from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import uuid
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.models.networks import Network
from app.schemas.schemas import AIInvestigationRequest, AIInvestigationResponse
from app.api.endpoints.networks import get_network_evidence
from app.models.audit import AuditLog

router = APIRouter()

@router.post("/{network_id}/analyze", response_model=AIInvestigationResponse)
def analyze_network(network_id: str, request: AIInvestigationRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    net = db.query(Network).filter(Network.id == network_id).first()
    if not net:
        raise HTTPException(status_code=404, detail="Network not found")
        
    evidence = get_network_evidence(network_id, db, current_user)
    risk_score = evidence.get("risk_score", 0)
    shap_vals = evidence.get("shap_values", {})
    
    top_feature = max(shap_vals, key=shap_vals.get) if shap_vals and "error" not in shap_vals else "unknown"
    
    if net.status == "RESTRICTED":
        summary = "Network has already been restricted by an analyst. No further action is currently recommended unless new entities connect."
        confidence = "HIGH"
        action = "NONE"
    elif risk_score > 0.7:
        summary = f"Highly suspicious network. Model strongly flags {top_feature} as abnormal indicating coordinated abuse. Evidence suggests immediate human review is required."
        confidence = "HIGH"
        action = "PLACE_UNDER_REVIEW"
    elif risk_score > 0.4:
        summary = f"Network exhibits elevated risk due to {top_feature} but lacks definitive proof."
        confidence = "MEDIUM"
        action = "REQUEST_VERIFICATION"
    else:
        summary = "Network topology aligns with legitimate corporate or shared infrastructure behavior."
        confidence = "HIGH"
        action = "MARK_LEGITIMATE"
        
    return {
        "summary": summary,
        "confidence": confidence,
        "recommended_action": action
    }

@router.post("/{network_id}/resolve")
def resolve_case(network_id: str, resolution: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can resolve cases.")
        
    net = db.query(Network).filter(Network.id == network_id).first()
    if not net:
        raise HTTPException(status_code=404, detail="Network not found")
        
    try:
        audit = AuditLog(
            id=str(uuid.uuid4()),
            user_id=current_user.username,
            action="RESOLVE_CASE",
            resource_id=network_id,
            timestamp=datetime.utcnow(),
            details=f"Case resolved with action: {resolution}"
        )
        db.add(audit)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error during case resolution.")
        
    return {"status": "resolved", "resolution": resolution, "analyst": current_user.username}
