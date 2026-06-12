from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from models import User
from schemas import RegisterIn, LoginIn
from security import hash_password, verify_password

router = APIRouter(tags=["auth"])

@router.post("/register")
def register(data: RegisterIn, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == data.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="کاربر از قبل وجود دارد")

    if data.role not in ["sme", "admin"]:
        raise HTTPException(status_code=400, detail="role نامعتبر است")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "ثبتنام با موفقیت انجام شد", "user_id": user.id}

@router.post("/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="ایمیل یا رمز اشتباه است")

    # MVP: returns user_id only (no JWT). Replace with JWT later.
    return {"message": "ورود موفق", "user_id": user.id, "role": user.role, "name": user.name}
