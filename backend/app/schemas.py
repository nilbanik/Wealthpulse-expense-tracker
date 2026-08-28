from datetime import date, datetime
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field

# --- AUTH SCHEMAS ---
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    seed_demo_data: Optional[bool] = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None


# --- TRANSACTION SCHEMAS ---
class TransactionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    amount: Decimal = Field(..., gt=0)
    type: str = Field(..., pattern="^(INCOME|EXPENSE)$")
    category: str = Field(..., min_length=1, max_length=50)
    payment_method: str = Field(default="UPI", max_length=50)
    date: date
    note: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = Field(default=None, gt=0)
    type: Optional[str] = Field(default=None, pattern="^(INCOME|EXPENSE)$")
    category: Optional[str] = None
    payment_method: Optional[str] = None
    date: Optional[date] = None
    note: Optional[str] = None

class TransactionOut(TransactionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- BUDGET SCHEMAS ---
class BudgetBase(BaseModel):
    category: str
    monthly_limit: Decimal = Field(..., gt=0)
    month: str = Field(..., pattern=r"^\d{4}-(0[1-9]|1[0-2])$") # YYYY-MM

class BudgetCreate(BudgetBase):
    pass

class BudgetOut(BudgetBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetStatus(BaseModel):
    id: Optional[int] = None
    category: str
    month: str
    monthly_limit: Decimal
    spent_amount: Decimal
    remaining_amount: Decimal
    percentage_used: float
    status: str # "SAFE", "WARNING", "EXCEEDED"


# --- ANALYTICS SCHEMAS ---
class FinancialSummary(BaseModel):
    total_balance: Decimal
    total_income: Decimal
    total_expenses: Decimal
    savings_rate: float
    monthly_budget: Decimal
    monthly_spent: Decimal
    monthly_budget_remaining: Decimal
    active_alerts_count: int

class CategoryBreakdownItem(BaseModel):
    category: str
    total_amount: Decimal
    percentage: float
    transaction_count: int

class MonthlyTrendItem(BaseModel):
    month: str
    income: Decimal
    expense: Decimal
    net_savings: Decimal

class PaymentMethodBreakdownItem(BaseModel):
    method: str
    total_amount: Decimal
    count: int
    percentage: float
