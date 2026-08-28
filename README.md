# 💰 WealthPulse — Personal Finance & Expense Intelligence Dashboard

A full-stack, fintech-grade personal finance dashboard built with **React (Vite) + Tailwind CSS + Framer Motion + Recharts** on the frontend, and **Python FastAPI + SQLAlchemy + PostgreSQL** (with automatic SQLite zero-config fallback) + **JWT Authentication** on the backend.

---

## ✨ Key Features & Capabilities

### 1. 🔐 Multi-User Authentication & Data Isolation
- Secure JWT-based Authentication with password hashing (`bcrypt`).
- Each user account has isolated transactions, category budgets, and analytics.
- **1-Click Demo Account Login** directly on the landing page for instant evaluation.

### 2. 📊 Interactive Visual Analytics Hub
- **Category Donut Chart (Recharts)**: Interactive hover states, center dynamic totals, category legend chips, and toggle for Expense vs. Income.
- **Cash Flow Trajectory (Recharts)**: Dual view modes (Monthly Bar Comparison vs. Net Flow Area gradient) showing 6-month historical trends.
- **Fintech KPI Stats**: Animated counters for *Total Balance*, *Monthly Inflow*, *Monthly Outflow*, and *Savings Rate (%)*.

### 3. 🎯 Budget Alert & Threshold Guard
- Configure monthly spending ceilings per category (Food, Rent, Shopping, Investments, etc.).
- Real-time status indicators:
  - 🟢 **SAFE**: Spending < 80% of budget limit.
  - 🟡 **WARNING**: Spending &ge; 80% and < 100% of budget limit.
  - 🔴 **EXCEEDED / CRITICAL**: Spending &ge; 100% with glowing alert pulse.
- Notification bell dropdown showing all active category warnings and overages.

### 4. ⚡ Transaction Ledger & CSV Export
- Instant live search by title, notes, and categories.
- Multi-filtering by **Date Range**, **Category**, **Type (Income/Expense)**, and **Payment Method (UPI, Cards, Cash, Bank Transfer)**.
- Pagination & inline Edit/Delete actions.
- **1-Click Filtered CSV Export** streamed directly from the backend.

### 5. 🚀 1-Click Demo Data Generator
- Click **"Seed Demo Data"** to automatically populate 4 months of realistic financial transactions, salaries, SIPs, utilities, and budgets.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 (Vite), Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons, Axios, React Hot Toast, Canvas Confetti |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy 2.0, Pydantic v2, Pydantic Settings, Uvicorn, Python-Jose (JWT), Bcrypt |
| **Database** | PostgreSQL (Primary) with automatic fallback to SQLite (`sqlite:///./expense_tracker.db`) |

---

## 🚀 How to Run the Application

### Option A: Using Helper Scripts
1. Run `run_backend.bat` to start the backend on `http://localhost:8000`.
2. Run `run_frontend.bat` to start the frontend on `http://localhost:5173`.
3. Open `http://localhost:5173` in your browser.

### Option B: Manual Terminal Execution

#### 1. Start the Backend:
```bash
cd backend
..\venv\Scripts\uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation (Swagger UI) is available at: `http://localhost:8000/docs`

#### 2. Start the Frontend:
```bash
cd frontend
npm run dev
```
Access the application at `http://localhost:5173`

---

## 🎤 Interview Talking Points & Architecture Highlights

When discussing this project in interviews, highlight:
1. **Financial Math & Precision**: Handled using `Numeric(12, 2)` / `Decimal` in Python backend and SQL schemas to prevent floating-point inaccuracy.
2. **SQL Aggregations**: Efficient analytics endpoints leveraging `SUM(amount)`, `GROUP BY category`, `COUNT()`, and date extractions (`extract('year', date)`).
3. **Optimistic UI & Responsive Design**: Snappy transitions, glassmorphic layout, fluid mobile/desktop breakpoints, and reactive chart re-rendering.
4. **Resilient Database Layer**: Configured for production PostgreSQL while gracefully falling back to SQLite if PostgreSQL is offline during development.
