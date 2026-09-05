from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.audit import AuditLog
from typing import List

router = APIRouter()

@router.get("/")
def get_audit_logs(db: Session = Depends(get_db), current_user = Depends(get_current_user), limit: int = 100):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs
