<div align="center">

# 🏛️ WEALTHPULSE
### Institutional Private Wealth & Financial Liquidity Terminal

[![Live Demo](https://img.shields.io/badge/Live_App-wealthpulse.vercel.app-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://wealthpulse-expense-tracker.vercel.app/)
[![API Status](https://img.shields.io/badge/API_Service-Render_Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://wealthpulse-api-rbj4.onrender.com/)
[![Interactive Docs](https://img.shields.io/badge/Swagger_Docs-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://wealthpulse-api-rbj4.onrender.com/docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-EAB308?style=for-the-badge)](LICENSE)

<p align="center">
  A full-stack, enterprise-grade personal finance terminal featuring real-time multi-currency exchange, high-precision SQL aggregations, budget risk telemetry, and auditable CSV ledger streams.
</p>

---

### 🌐 Live Deployments
| Layer | Service | Deployment URL |
| :--- | :--- | :--- |
| **Frontend Client** | **Vercel Edge Network** | [https://wealthpulse-expense-tracker.vercel.app/](https://wealthpulse-expense-tracker.vercel.app/) |
| **Backend REST API** | **Render Cloud** | [https://wealthpulse-api-rbj4.onrender.com/](https://wealthpulse-api-rbj4.onrender.com/) |
| **Interactive API Specs** | **FastAPI Swagger UI** | [https://wealthpulse-api-rbj4.onrender.com/docs](https://wealthpulse-api-rbj4.onrender.com/docs) |

---

</div>

## 🛠️ Technology Stack & Badges

<div align="center">

### Frontend Ecosystem
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts_Data_Viz-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F59E0B?style=for-the-badge)

### Backend & Infrastructure
![Python 3.12](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy_ORM-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic_v2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render_Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=black)

</div>

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph ClientLayer ["🖥️ Client Layer (Vercel Edge Global CDN)"]
        UI["React 19 + Vite SPA"]
        Theme["Obsidian Glassmorphism & Card Border Beam"]
        Typewriter["Multi-Currency Typewriter Engine"]
        CurCtx["CurrencyContext (INR, USD, EUR, GBP, JPY, KWD, AED)"]
        RechartsEngine["Recharts Visual Analytics (Donut & Area Velocity)"]
    end

    subgraph SecurityGateway ["🛡️ Security & API Gateway"]
        CORS["CORS Middleware (Cross-Origin Policy)"]
        JWTGuard["JWT Bearer Token Validator"]
        BcryptSec["Bcrypt Password Hashing & Ciphering"]
    end

    subgraph BackendCore ["⚡ Backend Core Engine (FastAPI on Render)"]
        AuthRoute["/api/auth (Register, Login, Profile, Password)"]
        TxRoute["/api/transactions (CRUD, Multi-Filter, Pagination)"]
        BudRoute["/api/budgets (Threshold Telemetry Guard)"]
        AnalyticsRoute["/api/analytics (SQL Aggregations & Seeder)"]
        CSVStream["Streaming CSV Exporter"]
    end

    subgraph DatabaseLayer ["🗄️ Database & Persistence Layer"]
        SQLAlchemy["SQLAlchemy ORM (Decimal 12,2 Precision)"]
        PostgreSQL[("Managed PostgreSQL Database")]
        SQLiteFallback[("Zero-Config SQLite Fallback")]
    end

    UI -->|HTTPS / REST API Requests| SecurityGateway
    SecurityGateway -->|Authorized Request Context| BackendCore
    BackendCore -->|ORM Queries & Aggregations| SQLAlchemy
    SQLAlchemy -->|SQL Transactions| PostgreSQL
    SQLAlchemy -.->|Offline / Local Fallback| SQLiteFallback
```

---

## ✨ Core Key Features

### 1. 🌍 Dynamic Global Multi-Currency Engine
- Real-time exchange rate conversions and localized number formatting (`Intl.NumberFormat`) across 7 global currencies:
  - 🇮🇳 **INR** (`₹` - Indian Rupee)
  - 🇺🇸 **USD** (`$` - US Dollar)
  - 🇪🇺 **EUR** (`€` - Euro)
  - 🇬🇧 **GBP** (`£` - British Pound)
  - 🇯🇵 **JPY** (`¥` - Japanese Yen, zero-decimal precision)
  - 🇰🇼 **KWD** (`KD` - Kuwaiti Dinar, 3-decimal precision)
  - 🇦🇪 **AED** (`AED` - UAE Dirham)
- Switch currencies anytime via the header pill; charts, stat cards, and ledger rows convert instantaneously.

### 2. 🏛️ Institutional Terminal Aesthetic
- **Obsidian Dark Palette**: High-contrast `#05080c`, `#0a0f16`, and `#0e1622` surfaces accented with Vault Emerald (`#10b981`) and Champagne Gold (`#eab308`).
- **Interactive Card Border Beam**: Moving your cursor across the screen dynamically illuminates the borders and corners of nearby cards with an ambient emerald-gold specular highlight.
- **Precision Typography**: `JetBrains Mono` with tabular numeral alignment (`font-mono-num`), `Space Grotesk` display headings, and `Manrope` body font.

### 3. 📊 Visual Analytics & Macro Cashflow
- **Sector Allocation Donut (`Recharts`)**: Interactive hover slice detection, center summary label, and instant Expense/Income toggle.
- **Cash Flow Velocity Wave (`Recharts`)**: Area gradient vs. monthly bar chart comparison for income vs. outflow trajectory.

### 4. 🚨 Budget Risk Telemetry & Safeguards
- Real-time telemetry monitoring category expenditure limits:
  - 🟢 **Healthy / Safe** (< 80% used)
  - 🟡 **Advisory Warning** (80% – 99% used)
  - 🔴 **Ceiling Exceeded** ($\ge$ 100% with pulsating alert badge)
- Interactive Notification Bell dropdown providing immediate risk breakdown.

### 5. 📑 Treasury Ledger & CSV Export
- Search transactions by memo, note, or recipient entity.
- Multi-filtering by Category, Cashflow Type (Inflow/Outflow), Payment Method (UPI, Credit Card, Debit Card, Net Banking, Cash), and Date Range.
- **1-Click Filtered CSV Export** streamed directly to client storage.

### 6. 🔐 Multi-User Isolation & Security
- Isolated accounts with salted `bcrypt` password hashing and signed `JWT` access tokens.
- **1-Click Demo Evaluation Login** for instant evaluations.
- **Account & Security Modal**: Update display name, view creation timestamps, and change access passwords.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account (with optional 4-month sample ledger) | No |
| `POST` | `/api/auth/login` | Authenticate credentials and receive signed JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & metadata | Yes |
| `PUT` | `/api/auth/profile` | Update account display name | Yes |
| `PUT` | `/api/auth/change-password` | Update account password with verification | Yes |
| `GET` | `/api/transactions` | Query filtered & paginated transaction ledger records | Yes |
| `POST` | `/api/transactions` | Post new transaction to ledger | Yes |
| `PUT` | `/api/transactions/{id}` | Update existing transaction record | Yes |
| `DELETE` | `/api/transactions/{id}` | Purge transaction record from ledger | Yes |
| `GET` | `/api/transactions/export/csv` | Stream filtered transactions as `.csv` file | Yes |
| `GET` | `/api/budgets` | Fetch monthly budget ceilings with active threshold statuses | Yes |
| `POST` | `/api/budgets` | Create or update category monthly ceiling | Yes |
| `DELETE` | `/api/budgets/{id}` | Disengage budget ceiling target | Yes |
| `GET` | `/api/analytics/summary` | Compute net liquidity, monthly inflow, outflow, & savings rate | Yes |
| `GET` | `/api/analytics/categories` | SQL aggregation of category disbursements & percentages | Yes |
| `GET` | `/api/analytics/monthly-trend`| 6-month historical liquidity trajectory | Yes |
| `POST` | `/api/analytics/seed` | Seed 4-month realistic sample transactions and budgets | Yes |

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **PostgreSQL** (Optional — automatically falls back to SQLite if PostgreSQL is not active)

### 1. Clone the Repository
```bash
git clone https://github.com/nilbanik/Wealthpulse-expense-tracker.git
cd Wealthpulse-expense-tracker
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API will run at `http://localhost:8000` (Docs at `http://localhost:8000/docs`).

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

## 📄 License
This project is open-source and available under the **MIT License**.
