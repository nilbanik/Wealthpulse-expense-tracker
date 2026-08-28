from datetime import date
from typing import Optional, List
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Budget, Transaction, User
from app.schemas import BudgetCreate, BudgetOut, BudgetStatus
from app.auth import get_current_user

router = APIRouter(prefix="/api/budgets", tags=["Budgets"])

@router.get("", response_model=List[BudgetStatus])
def get_user_budgets(
    month: Optional[str] = Query(None, description="Month in YYYY-MM format"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_month = month or date.today().strftime("%Y-%m")
    
    # Fetch budgets configured for this month
    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == target_month
    ).all()

    # Calculate spent amounts per category in this month
    year, month_num = map(int, target_month.split("-"))
    
    results: List[BudgetStatus] = []
    
    for b in budgets:
        # Sum expenses for this category in the given month
        query = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "EXPENSE",
            func.extract("year", Transaction.date) == year,
            func.extract("month", Transaction.date) == month_num
        )
        
        if b.category != "ALL":
            query = query.filter(Transaction.category == b.category)
            
        spent = Decimal(str(query.scalar()))
        limit = Decimal(str(b.monthly_limit))
        remaining = max(Decimal("0.00"), limit - spent)
        
        percentage = float((spent / limit) * 100) if limit > 0 else 0.0
        
        if percentage >= 100.0:
            status_flag = "EXCEEDED"
        elif percentage >= 80.0:
            status_flag = "WARNING"
        else:
            status_flag = "SAFE"
            
        results.append(BudgetStatus(
            id=b.id,
            category=b.category,
            month=b.month,
            monthly_limit=limit,
            spent_amount=spent,
            remaining_amount=remaining,
            percentage_used=round(percentage, 1),
            status=status_flag
        ))
        
    return results

@router.post("", response_model=BudgetOut, status_code=status.HTTP_201_CREATED)
def set_budget(
    budget_in: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if budget already exists for this category & month -> update it
    existing_budget = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.category == budget_in.category,
        Budget.month == budget_in.month
    ).first()

    if existing_budget:
        existing_budget.monthly_limit = budget_in.monthly_limit
        db.commit()
        db.refresh(existing_budget)
        return existing_budget

    new_budget = Budget(
        user_id=current_user.id,
        category=budget_in.category,
        monthly_limit=budget_in.monthly_limit,
        month=budget_in.month
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget limit not found.")
        
    db.delete(budget)
    db.commit()
    return None
