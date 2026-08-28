import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("uvicorn.error")

DATABASE_URL = settings.DATABASE_URL
engine = None
SessionLocal = None
Base = declarative_base()

try:
    # Try connecting to the specified DATABASE_URL (PostgreSQL by default)
    temp_engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        connect_args={"connect_timeout": 3} if "postgresql" in DATABASE_URL else {}
    )
    # Test connection
    with temp_engine.connect() as conn:
        pass
    engine = temp_engine
    logger.info(f"Connected successfully to PostgreSQL database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
except Exception as e:
    logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to local SQLite database for instant zero-config operation.")
    SQLITE_URL = "sqlite:///./expense_tracker.db"
    engine = create_engine(
        SQLITE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
