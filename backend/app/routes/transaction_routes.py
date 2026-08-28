import csv
import io
from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import or_, desc, asc
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction, User
from app.schemas import TransactionCreate, TransactionUpdate, TransactionOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("", response_model=dict)
def get_transactions(
    search: Optional[str] = Query(None, description="Search in title or note"),
    category: Optional[str] = Query(None, description="Filter by category"),
    type: Optional[str] = Query(None, pattern="^(INCOME|EXPENSE)$", description="Filter by type"),
    payment_method: Optional[str] = Query(None, description="Filter by payment method"),
    start_date: Optional[date] = Query(None, description="Filter from date"),
    end_date: Optional[date] = Query(None, description="Filter to date"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=200),
    sort_by: str = Query("date", pattern="^(date|amount|created_at|title)$"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Transaction.title.ilike(search_pattern),
                Transaction.note.ilike(search_pattern),
                Transaction.category.ilike(search_pattern)
            )
        )

    if category and category.lower() != "all":
        query = query.filter(Transaction.category == category)

    if type and type.lower() != "all":
        query = query.filter(Transaction.type == type.upper())

    if payment_method and payment_method.lower() != "all":
        query = query.filter(Transaction.payment_method == payment_method)

    if start_date:
        query = query.filter(Transaction.date >= start_date)

    if end_date:
        query = query.filter(Transaction.date <= end_date)

    total_count = query.count()

    # Sorting
    sort_column = getattr(Transaction, sort_by, Transaction.date)
    if order == "desc":
        query = query.order_by(desc(sort_column), desc(Transaction.id))
    else:
        query = query.order_by(asc(sort_column), asc(Transaction.id))

    offset = (page - 1) * limit
    transactions = query.offset(offset).limit(limit).all()

    return {
        "items": [
            {
                "id": t.id,
                "user_id": t.user_id,
                "title": t.title,
                "amount": float(t.amount),
                "type": t.type,
                "category": t.category,
                "payment_method": t.payment_method,
                "date": t.date.isoformat(),
                "note": t.note,
                "created_at": t.created_at.isoformat() if t.created_at else None
            }
            for t in transactions
        ],
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit if total_count > 0 else 1
    }

@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_tx = Transaction(
        user_id=current_user.id,
        title=transaction_in.title.strip(),
        amount=transaction_in.amount,
        type=transaction_in.type.upper(),
        category=transaction_in.category.strip(),
        payment_method=transaction_in.payment_method.strip(),
        date=transaction_in.date,
        note=transaction_in.note.strip() if transaction_in.note else None
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.get("/export/csv")
def export_transactions_csv(
    search: Optional[str] = None,
    category: Optional[str] = None,
    type: Optional[str] = None,
    payment_method: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Transaction.title.ilike(search_pattern),
                Transaction.note.ilike(search_pattern),
                Transaction.category.ilike(search_pattern)
            )
        )

    if category and category.lower() != "all":
        query = query.filter(Transaction.category == category)

    if type and type.lower() != "all":
        query = query.filter(Transaction.type == type.upper())

    if payment_method and payment_method.lower() != "all":
        query = query.filter(Transaction.payment_method == payment_method)

    if start_date:
        query = query.filter(Transaction.date >= start_date)

    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.order_by(desc(Transaction.date), desc(Transaction.id)).all()

    # Create in-memory CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "Type", "Category", "Amount (INR)", "Payment Method", "Date", "Note"])

    for tx in transactions:
        writer.writerow([
            tx.id,
            tx.title,
            tx.type,
            tx.category,
            f"{float(tx.amount):.2f}",
            tx.payment_method,
            tx.date.strftime("%Y-%m-%d"),
            tx.note or ""
        ])

    csv_data = output.getvalue()
    filename = f"transactions_export_{date.today().strftime('%Y%m%d')}.csv"
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{transaction_id}", response_model=TransactionOut)
def get_transaction_by_id(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
    return tx

@router.put("/{transaction_id}", response_model=TransactionOut)
def update_transaction(
    transaction_id: int,
    tx_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")

    update_data = tx_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "type" and value:
            value = value.upper()
        setattr(tx, key, value)

    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")

    db.delete(tx)
    db.commit()
    return None
