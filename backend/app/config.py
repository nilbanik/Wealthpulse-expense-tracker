import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/expense_tracker")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretjwtkey_for_expense_tracker_2026_fintech_app_secure_token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
