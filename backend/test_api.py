import sys
import os
from decimal import Decimal
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("--- 1. Testing Root Endpoint ---")
    r = client.get("/")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    print(" Root is healthy:", r.json())

    print("\n--- 2. Testing User Registration ---")
    test_user = {
        "name": "Demo Trader",
        "email": f"demo_user_{os.urandom(4).hex()}@test.com",
        "password": "Password123!"
    }
    r = client.post("/api/auth/register", json=test_user)
    assert r.status_code == 201, f"Registration failed: {r.text}"
    token_data = r.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(" User registered. JWT Token received:", token[:20] + "...")

    print("\n--- 3. Testing User Login ---")
    r = client.post("/api/auth/login", json={"email": test_user["email"], "password": test_user["password"]})
    assert r.status_code == 200
    print(" User login verified.")

    print("\n--- 4. Testing Seed Demo Data ---")
    r = client.post("/api/analytics/seed", headers=headers)
    assert r.status_code == 200, f"Seed failed: {r.text}"
    print(" Demo data seeded:", r.json()["message"])

    print("\n--- 5. Testing Financial Summary Analytics ---")
    r = client.get("/api/analytics/summary", headers=headers)
    assert r.status_code == 200
    summary = r.json()
    print(" Financial Summary:", summary)
    assert Decimal(str(summary["total_income"])) > 0
    assert Decimal(str(summary["total_expenses"])) > 0

    print("\n--- 6. Testing Category Breakdown (SQL Aggregations) ---")
    r = client.get("/api/analytics/categories?type=EXPENSE", headers=headers)
    assert r.status_code == 200
    categories = r.json()
    print(f" Category Breakdown ({len(categories)} categories found):", [c["category"] for c in categories])

    print("\n--- 7. Testing Budget Status & Alert System ---")
    r = client.get("/api/budgets", headers=headers)
    assert r.status_code == 200
    budgets = r.json()
    print(" Budgets list:")
    for b in budgets:
        print(f"   - {b['category']}: Limit={b['monthly_limit']}, Spent={b['spent_amount']}, Status={b['status']} ({b['percentage_used']}%)")

    print("\n--- 8. Testing Transaction Querying & Filters ---")
    r = client.get("/api/transactions?limit=5", headers=headers)
    assert r.status_code == 200
    txs = r.json()
    print(f" Retrieved {len(txs['items'])} of {txs['total']} total transactions.")

    print("\n--- 9. Testing CSV Export Stream ---")
    r = client.get("/api/transactions/export/csv", headers=headers)
    assert r.status_code == 200
    assert "text/csv" in r.headers["content-type"]
    lines = r.text.strip().split("\n")
    print(f" CSV exported successfully with {len(lines)} lines (Header: {lines[0]})")

    print("\n=======================================================")
    print(" ALL BACKEND TESTS PASSED WITH 100% SUCCESS!")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
