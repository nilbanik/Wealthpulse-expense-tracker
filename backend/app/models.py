from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(String(20), nullable=False) # "INCOME" or "EXPENSE"
    category = Column(String(50), nullable=False, index=True) # Food, Rent, Shopping, Investments, Salary, Utilities, Entertainment, Health, etc.
    payment_method = Column(String(50), nullable=False, default="UPI") # UPI, Credit Card, Debit Card, Cash, Bank Transfer
    date = Column(Date, nullable=False, default=date.today, index=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False) # Specific category or "ALL" for overall budget
    monthly_limit = Column(Numeric(12, 2), nullable=False)
    month = Column(String(7), nullable=False) # Format: YYYY-MM
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="budgets")
