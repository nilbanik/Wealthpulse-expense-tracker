from datetime import date, datetime, timedelta
from typing import List, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, desc, extract
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction, Budget, User
from app.schemas import (
    FinancialSummary,
    CategoryBreakdownItem,
    MonthlyTrendItem,
    PaymentMethodBreakdownItem,
    BudgetStatus
)
from app.auth import get_current_user
import random

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/summary", response_model=FinancialSummary)
def get_financial_summary(
    month: Optional[str] = Query(None, description="Month in YYYY-MM format"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_month = month or date.today().strftime("%Y-%m")
    year, month_num = map(int, target_month.split("-"))

    # Overall Lifetime Income & Expense
    total_income_lifetime = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "INCOME"
    ).scalar() or 0

    total_expense_lifetime = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "EXPENSE"
    ).scalar() or 0

    total_balance = Decimal(str(total_income_lifetime)) - Decimal(str(total_expense_lifetime))

    # Current Month Income & Expense
    current_month_income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "INCOME",
        extract("year", Transaction.date) == year,
        extract("month", Transaction.date) == month_num
    ).scalar() or 0

    current_month_expense = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "EXPENSE",
        extract("year", Transaction.date) == year,
        extract("month", Transaction.date) == month_num
    ).scalar() or 0

    income_dec = Decimal(str(current_month_income))
    expense_dec = Decimal(str(current_month_expense))

    # Savings rate for current month
    if income_dec > 0:
        savings_rate = float(max(0, ((income_dec - expense_dec) / income_dec) * 100))
    else:
        savings_rate = 0.0

    # Monthly Budget Limits & Active Alerts
    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == target_month
    ).all()

    total_budget_limit = sum(Decimal(str(b.monthly_limit)) for b in budgets if b.category == "ALL")
    if total_budget_limit == 0:
        # Sum specific category budgets if no ALL budget
        total_budget_limit = sum(Decimal(str(b.monthly_limit)) for b in budgets)

    budget_remaining = max(Decimal("0.00"), total_budget_limit - expense_dec) if total_budget_limit > 0 else Decimal("0.00")

    # Count active threshold alerts (warning >80% or exceeded >=100%)
    active_alerts = 0
    for b in budgets:
        cat_spent_query = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "EXPENSE",
            extract("year", Transaction.date) == year,
            extract("month", Transaction.date) == month_num
        )
        if b.category != "ALL":
            cat_spent_query = cat_spent_query.filter(Transaction.category == b.category)
        cat_spent = Decimal(str(cat_spent_query.scalar()))
        if b.monthly_limit > 0 and (cat_spent / Decimal(str(b.monthly_limit))) >= Decimal("0.8"):
            active_alerts += 1

    return FinancialSummary(
        total_balance=total_balance,
        total_income=income_dec,
        total_expenses=expense_dec,
        savings_rate=round(savings_rate, 1),
        monthly_budget=total_budget_limit,
        monthly_spent=expense_dec,
        monthly_budget_remaining=budget_remaining,
        active_alerts_count=active_alerts
    )


@router.get("/categories", response_model=List[CategoryBreakdownItem])
def get_category_breakdown(
    month: Optional[str] = Query(None, description="Month in YYYY-MM format"),
    type: str = Query("EXPENSE", pattern="^(EXPENSE|INCOME)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(
        Transaction.category,
        func.sum(Transaction.amount).label("total_amount"),
        func.count(Transaction.id).label("count")
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == type.upper()
    )

    if month and month.lower() != "all":
        year, month_num = map(int, month.split("-"))
        query = query.filter(
            extract("year", Transaction.date) == year,
            extract("month", Transaction.date) == month_num
        )

    results = query.group_by(Transaction.category).order_by(desc("total_amount")).all()

    total_sum = sum(Decimal(str(r[1])) for r in results) if results else Decimal("0.00")

    breakdown = []
    for cat, total, count in results:
        tot_dec = Decimal(str(total))
        pct = float((tot_dec / total_sum) * 100) if total_sum > 0 else 0.0
        breakdown.append(CategoryBreakdownItem(
            category=cat,
            total_amount=tot_dec,
            percentage=round(pct, 1),
            transaction_count=count
        ))

    return breakdown


@router.get("/monthly-trend", response_model=List[MonthlyTrendItem])
def get_monthly_trend(
    months_count: int = Query(6, ge=2, le=24),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get last N months
    today = date.today()
    months_list = []
    
    for i in range(months_count - 1, -1, -1):
        # Calculate year and month
        y = today.year
        m = today.month - i
        while m <= 0:
            m += 12
            y -= 1
        month_str = f"{y:04d}-{m:02d}"
        months_list.append((y, m, month_str))

    trend_items = []
    for y, m, m_str in months_list:
        # Sum income
        income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "INCOME",
            extract("year", Transaction.date) == y,
            extract("month", Transaction.date) == m
        ).scalar() or 0

        # Sum expense
        expense = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "EXPENSE",
            extract("year", Transaction.date) == y,
            extract("month", Transaction.date) == m
        ).scalar() or 0

        inc_dec = Decimal(str(income))
        exp_dec = Decimal(str(expense))
        month_label = datetime(y, m, 1).strftime("%b %Y")

        trend_items.append(MonthlyTrendItem(
            month=month_label,
            income=inc_dec,
            expense=exp_dec,
            net_savings=inc_dec - exp_dec
        ))

    return trend_items


@router.get("/payment-methods", response_model=List[PaymentMethodBreakdownItem])
def get_payment_methods_breakdown(
    month: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(
        Transaction.payment_method,
        func.sum(Transaction.amount).label("total_amount"),
        func.count(Transaction.id).label("count")
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "EXPENSE"
    )

    if month and month.lower() != "all":
        year, month_num = map(int, month.split("-"))
        query = query.filter(
            extract("year", Transaction.date) == year,
            extract("month", Transaction.date) == month_num
        )

    results = query.group_by(Transaction.payment_method).order_by(desc("total_amount")).all()
    total_sum = sum(Decimal(str(r[1])) for r in results) if results else Decimal("0.00")

    breakdown = []
    for method, total, count in results:
        tot_dec = Decimal(str(total))
        pct = float((tot_dec / total_sum) * 100) if total_sum > 0 else 0.0
        breakdown.append(PaymentMethodBreakdownItem(
            method=method,
            total_amount=tot_dec,
            count=count,
            percentage=round(pct, 1)
        ))

    return breakdown


@router.post("/seed", response_model=dict)
def seed_user_demo_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Clear existing data for this user to avoid duplicates if re-seeding
    db.query(Transaction).filter(Transaction.user_id == current_user.id).delete()
    db.query(Budget).filter(Budget.user_id == current_user.id).delete()

    today = date.today()
    sample_categories = {
        "Food": ["Grocery Run", "Swiggy / Zomato Order", "Dinner at Cafe", "Coffee & Snacks", "Supermarket Restock"],
        "Rent": ["Apartment Monthly Rent", "Maintenance & Utilities"],
        "Shopping": ["Amazon Electronics", "Clothing & Apparel", "Home Essentials", "Gadget Accessories"],
        "Investments": ["Mutual Fund SIP", "Index Fund Allocation", "Stock Portfolio Top-up", "Gold ETF"],
        "Utilities": ["High-speed WiFi Bill", "Electricity Bill", "Mobile Recharge", "Gas Pipeline"],
        "Entertainment": ["Netflix & Spotify Subscription", "Weekend Cinema Tickets", "Gaming Pass", "Concert Tickets"],
        "Health": ["Pharmacy Medicines", "Gym Membership", "Health Insurance Premium", "Dental Checkup"],
        "Salary": ["Monthly Base Salary Credit", "Performance Bonus", "Freelance Web Project", "Consulting Stipend"]
    }

    payment_methods = ["UPI", "Credit Card", "Debit Card", "Bank Transfer", "Cash"]
    
    transactions_to_add = []
    
    # Generate 4 months of data
    for m_offset in range(3, -1, -1):
        y = today.year
        m = today.month - m_offset
        while m <= 0:
            m += 12
            y -= 1
        month_str = f"{y:04d}-{m:02d}"

        # 1. Salary Credit (Income)
        transactions_to_add.append(Transaction(
            user_id=current_user.id,
            title="Monthly Salary Credit",
            amount=Decimal("85000.00"),
            type="INCOME",
            category="Salary",
            payment_method="Bank Transfer",
            date=date(y, m, 1),
            note="Tech Corp Monthly Payroll"
        ))

        # Freelance Income (occasional)
        if m_offset in (0, 2):
            transactions_to_add.append(Transaction(
                user_id=current_user.id,
                title="Freelance React Frontend Project",
                amount=Decimal("25000.00"),
                type="INCOME",
                category="Salary",
                payment_method="UPI",
                date=date(y, m, 12),
                note="Client payment"
            ))

        # 2. Fixed Rent & Utilities
        transactions_to_add.append(Transaction(
            user_id=current_user.id,
            title="Apartment Rent",
            amount=Decimal("22000.00"),
            type="EXPENSE",
            category="Rent",
            payment_method="Bank Transfer",
            date=date(y, m, 3),
            note="2BHK Monthly Lease"
        ))
        
        transactions_to_add.append(Transaction(
            user_id=current_user.id,
            title="Broadband Internet & Electricity",
            amount=Decimal("3200.00"),
            type="EXPENSE",
            category="Utilities",
            payment_method="UPI",
            date=date(y, m, 5),
            note="Airtel Fiber + Power"
        ))

        # 3. Investments SIP
        transactions_to_add.append(Transaction(
            user_id=current_user.id,
            title="Nifty 50 Index Fund SIP",
            amount=Decimal("15000.00"),
            type="EXPENSE",
            category="Investments",
            payment_method="Bank Transfer",
            date=date(y, m, 10),
            note="Auto-debit investment"
        ))

        # 4. Food / Dining Transactions
        food_amounts = [650.0, 1400.0, 3200.0, 450.0, 890.0, 1850.0]
        for idx, famt in enumerate(food_amounts):
            day = min(28, 2 + (idx * 4))
            transactions_to_add.append(Transaction(
                user_id=current_user.id,
                title=random.choice(sample_categories["Food"]),
                amount=Decimal(f"{famt:.2f}"),
                type="EXPENSE",
                category="Food",
                payment_method=random.choice(["UPI", "Credit Card", "Debit Card"]),
                date=date(y, m, day),
                note="Food & Dining"
            ))

        # 5. Shopping / Entertainment
        transactions_to_add.append(Transaction(
            user_id=current_user.id,
            title=random.choice(sample_categories["Shopping"]),
            amount=Decimal(str(random.choice([2499.00, 4850.00, 1200.00, 3100.00]))),
            type="EXPENSE",
            category="Shopping",
            payment_method="Credit Card",
            date=date(y, m, 15),
            note="E-commerce store purchase"
        ))

        transactions_to_add.append(Transaction(
            user_id=current_user.id,
            title=random.choice(sample_categories["Entertainment"]),
            amount=Decimal(str(random.choice([799.00, 1500.00, 999.00]))),
            type="EXPENSE",
            category="Entertainment",
            payment_method="UPI",
            date=date(y, m, 20),
            note="Weekend recreation"
        ))

        # Setup monthly budgets
        db.add(Budget(user_id=current_user.id, category="Food", monthly_limit=Decimal("10000.00"), month=month_str))
        db.add(Budget(user_id=current_user.id, category="Shopping", monthly_limit=Decimal("6000.00"), month=month_str))
        db.add(Budget(user_id=current_user.id, category="Entertainment", monthly_limit=Decimal("3000.00"), month=month_str))
        db.add(Budget(user_id=current_user.id, category="Rent", monthly_limit=Decimal("25000.00"), month=month_str))

    db.add_all(transactions_to_add)
    db.commit()

    return {
        "message": "Demo data populated successfully with 4 months of transactions and category budgets.",
        "transactions_count": len(transactions_to_add)
    }
