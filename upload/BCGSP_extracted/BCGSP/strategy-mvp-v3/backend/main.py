from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import engine, get_db
from models import Base, Report
from schemas import AnswersIn
from logic.diagnostic import analyze_strategy
from logic.roadmap import generate_roadmap
from auth import router as auth_router
from admin import router as admin_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Strategy Diagnostic MVP v3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] ,
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"] ,
)

app.include_router(auth_router)
app.include_router(admin_router)

@app.post("/diagnose", tags=["diagnostic"])
def diagnose(data: AnswersIn, db: Session = Depends(get_db)):
    analysis = analyze_strategy(data.model_dump())
    roadmap = generate_roadmap(analysis)

    report = Report(
        user_id=data.user_id,
        score=analysis["score"],
        key_failures=" | ".join(analysis["key_failures"]),
        bottlenecks=" | ".join(analysis["bottlenecks"]),
        roadmap=" | ".join(roadmap),
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "report_id": report.id,
        "readiness_score": analysis["score"],
        "key_failures": analysis["key_failures"],
        "growth_bottlenecks": analysis["bottlenecks"],
        "roadmap": roadmap,
    }

@app.get("/reports/{user_id}", tags=["diagnostic"])
def get_reports(user_id: int, db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.user_id == user_id).order_by(Report.created_at.desc()).all()
    if not reports:
        raise HTTPException(status_code=404, detail="هیچ گزارشی یافت نشد")
    return [
        {
            "id": r.id,
            "score": r.score,
            "roadmap": r.roadmap.split(" | "),
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in reports
    ]
