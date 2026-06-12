# Strategy Diagnostic MVP v3 (SME + Admin Dashboard)

## 1) Run backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000

## 2) Run frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

## 3) Quick test flow

1. Register an **admin** user (role=admin)
2. Register one or more **SME** users (role=sme)
3. Login as SME -> submit a diagnostic -> see score + roadmap
4. Login as admin -> see ranked list of SMEs + open each user's detailed reports

## Notes
- This is an MVP: auth returns `user_id` (no JWT). Admin endpoints check `admin_user_id`.
- Replace with JWT + RBAC in production.
