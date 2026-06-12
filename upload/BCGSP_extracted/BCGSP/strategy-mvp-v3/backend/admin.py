from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from models import User, Report

router = APIRouter(prefix="/admin", tags=["admin"])

# MVP security note:
# We accept admin_user_id as a query param and check role in DB.
# Replace with proper JWT/ACL later.

def _ensure_admin(admin_user_id: int, db: Session) -> None:
    admin = db.query(User).filter(User.id == admin_user_id).first()
    if not admin or admin.role != "admin":
        raise HTTPException(status_code=403, detail="دسترسی غیرمجاز")

@router.get("/overview")
def overview(admin_user_id: int, db: Session = Depends(get_db)):
    _ensure_admin(admin_user_id, db)

    users = db.query(User).filter(User.role == "sme").all()
    results = []
    for u in users:
        reports = db.query(Report).filter(Report.user_id == u.id).all()
        if not reports:
            continue
        avg_score = sum(r.score for r in reports) / len(reports)
        results.append({
            "user_id": u.id,
            "name": u.name,
            "email": u.email,
            "num_reports": len(reports),
            "avg_score": round(avg_score, 1),
            "investment_ready": True if avg_score >= 70 else False,
        })

    # sort: best first
    results.sort(key=lambda x: x["avg_score"], reverse=True)
    return results

@router.get("/user/{user_id}/reports")
def user_reports(user_id: int, admin_user_id: int, db: Session = Depends(get_db)):
    _ensure_admin(admin_user_id, db)
    reports = db.query(Report).filter(Report.user_id == user_id).order_by(Report.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "score": r.score,
            "key_failures": r.key_failures.split(" | "),
            "bottlenecks": r.bottlenecks.split(" | "),
            "roadmap": r.roadmap.split(" | "),
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in reports
    ]
