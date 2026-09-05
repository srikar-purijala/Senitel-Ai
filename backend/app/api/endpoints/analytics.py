from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user

router = APIRouter()

@router.get("/")
def get_analytics(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # In a real scenario, this would dynamically calculate model drift or pull from MLFlow.
    # We return the static results from Phase 3 evaluation for the hackathon dashboard.
    return {
        "metrics": {
            "precision": 0.985,
            "recall": 0.972,
            "f1_score": 0.978,
            "false_positive_rate": 0.012
        },
        "feature_importance": [
            {"name": "density", "importance": 0.45},
            {"name": "device_reuse_ratio", "importance": 0.32},
            {"name": "edge_count", "importance": 0.15},
            {"name": "time_span_seconds", "importance": 0.08}
        ],
        "risk_distribution": [
            {"bucket": "Low (0.0-0.3)", "count": 142},
            {"bucket": "Medium (0.3-0.7)", "count": 28},
            {"bucket": "High (0.7-1.0)", "count": 14}
        ]
    }
