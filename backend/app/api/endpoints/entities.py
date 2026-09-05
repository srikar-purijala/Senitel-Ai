from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.entities import Entity

router = APIRouter()

@router.get("/")
def get_entities(db: Session = Depends(get_db), current_user = Depends(get_current_user), limit: int = 200):
    entities = db.query(Entity).limit(limit).all()
    return entities
