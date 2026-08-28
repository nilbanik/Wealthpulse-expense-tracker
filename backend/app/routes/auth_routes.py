from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Transaction, Budget
from app.schemas import UserCreate, UserLogin, UserOut, Token, UserUpdate, PasswordChange
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import date
from decimal import Decimal
import random

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Hash password and create user
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        name=user_in.name.strip(),
        email=user_in.email.lower().strip(),
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # If user selected to seed demo data on registration
    if user_in.seed_demo_data:
        from app.routes.analytics_routes import seed_user_demo_data
        seed_user_demo_data(current_user=new_user, db=db)

    # Generate JWT token
    access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower().strip()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your email and password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    profile_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.name:
        current_user.name = profile_in.name.strip()
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/change-password", response_model=dict)
def change_password(
    pwd_in: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(pwd_in.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The current password you entered is incorrect."
        )

    current_user.hashed_password = get_password_hash(pwd_in.new_password)
    db.commit()
    return {"message": "Security credentials updated successfully."}
