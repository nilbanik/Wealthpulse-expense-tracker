import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes.auth_routes import router as auth_router
from app.routes.transaction_routes import router as transaction_router
from app.routes.budget_routes import router as budget_router
from app.routes.analytics_routes import router as analytics_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.info")

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Finance & Expense Tracker API",
    description="High-performance backend API for multi-user transaction management, budgeting, SQL analytics, and CSV export.",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth_router)
app.include_router(transaction_router)
app.include_router(budget_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "Personal Finance & Expense Tracker API",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
