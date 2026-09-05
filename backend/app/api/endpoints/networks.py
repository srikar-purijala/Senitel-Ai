from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import networkx as nx
from datetime import datetime
import uuid

from app.api.deps import get_db, get_current_user
from app.models.networks import Network, NetworkEntity
from app.models.entities import Entity
from app.models.relationships import Edge
from app.models.audit import AuditLog
from app.schemas.schemas import NetworkOut, GraphData, EvidenceOut
from app.graph.builder import build_heterogeneous_graph
from app.graph.analysis import compute_network_features
from app.ml.risk_model import predict_risk
from pydantic import BaseModel

router = APIRouter()

class ActionRequest(BaseModel):
    action_type: str
    mode: str = "PRODUCTION"
    reason: str = ""

@router.get("/", response_model=List[NetworkOut])
def list_networks(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    networks = db.query(Network).all()
    return networks

@router.get("/pending", response_model=List[NetworkOut])
def list_pending_networks(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Decision Queue: high risk networks waiting for a human decision
    networks = db.query(Network).filter(Network.status == 'ACTIVE', Network.is_abuse == True).all()
    return networks

@router.get("/{network_id}", response_model=NetworkOut)
def get_network(network_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    net = db.query(Network).filter(Network.id == network_id).first()
    if not net:
        raise HTTPException(status_code=404, detail="Network not found")
    return net

@router.post("/{network_id}/action", response_model=NetworkOut)
def execute_network_action(network_id: str, req: ActionRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role not in ["ANALYST", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    net = db.query(Network).filter(Network.id == network_id).first()
    if not net:
        raise HTTPException(status_code=404, detail="Network not found")

    old_status = net.status
    
    action_status_map = {
        "PLACE_UNDER_REVIEW": "UNDER_REVIEW",
        "MARK_LEGITIMATE": "LEGITIMATE",
        "MARK_SUSPICIOUS": "SUSPICIOUS",
        "RESTRICT": "RESTRICTED",
        "RESOLVE": "RESOLVED"
    }

    if req.action_type in action_status_map:
        net.status = action_status_map[req.action_type]
    
    # Audit log
    audit = AuditLog(
        id=str(uuid.uuid4()),
        user_id=current_user.username,
        action=f"NETWORK_ACTION:{req.action_type}",
        resource_id=network_id,
        timestamp=datetime.utcnow(),
        details=f"Previous: {old_status}, New: {net.status}, Mode: {req.mode}, Reason: {req.reason}"
    )
    db.add(audit)
    db.commit()
    db.refresh(net)
    
    return net

@router.get("/{network_id}/graph", response_model=GraphData)
def get_network_graph(network_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    net = db.query(Network).filter(Network.id == network_id).first()
    if not net:
        raise HTTPException(status_code=404, detail="Network not found")
        
    net_entities = db.query(NetworkEntity).filter(NetworkEntity.network_id == network_id).all()
    entity_ids = [ne.entity_id for ne in net_entities]
    
    entities = db.query(Entity).filter(Entity.id.in_(entity_ids)).all()
    
    edges = db.query(Edge).filter(
        Edge.source_entity_id.in_(entity_ids),
        Edge.target_entity_id.in_(entity_ids)
    ).all()
    
    nodes_out = [{"id": e.id, "entity_type": e.entity_type, "entity_value": e.entity_value, "is_synthetic": e.is_synthetic} for e in entities]
    edges_out = [{"source": e.source_entity_id, "target": e.target_entity_id, "relationship_type": e.relationship_type, "weight": e.weight} for e in edges]
    
    return {"nodes": nodes_out, "edges": edges_out}

@router.get("/{network_id}/evidence", response_model=EvidenceOut)
def get_network_evidence(network_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    net_entities = db.query(NetworkEntity).filter(NetworkEntity.network_id == network_id).all()
    if not net_entities:
        raise HTTPException(status_code=404, detail="Network has no entities")
        
    entity_ids = [ne.entity_id for ne in net_entities]
    G_full = build_heterogeneous_graph(db, include_transactions=False)
    subgraph = G_full.subgraph(entity_ids).copy()
    features = compute_network_features(subgraph)
    
    try:
        score, shap_evidence = predict_risk(features)
    except Exception as e:
        score = 0.5
        shap_evidence = {"error": str(e)}
        
    return {
        "network_id": network_id,
        "risk_score": score,
        "shap_values": shap_evidence
    }
