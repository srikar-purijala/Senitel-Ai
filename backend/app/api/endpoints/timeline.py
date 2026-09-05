from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.models.transactions import Transaction
from app.models.networks import NetworkEntity
from app.schemas.schemas import Token

router = APIRouter()

class TimelineEvent(BaseModel):
    id: str
    event_type: str
    timestamp: datetime
    details: Dict[str, Any]
    
    model_config = ConfigDict(from_attributes=True)

@router.get("/{network_id}/timeline", response_model=List[TimelineEvent])
def get_network_timeline(network_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    net_entities = db.query(NetworkEntity).filter(NetworkEntity.network_id == network_id).all()
    if not net_entities:
        raise HTTPException(status_code=404, detail="Network has no entities")
        
    entity_ids = [ne.entity_id for ne in net_entities]
    
    # Fetch transactions involving these entities
    transactions = db.query(Transaction).filter(Transaction.customer_id.in_(entity_ids)).order_by(Transaction.timestamp).all()
    
    timeline = []
    for txn in transactions:
        timeline.append(
            TimelineEvent(
                id=txn.id,
                event_type="TRANSACTION",
                timestamp=txn.timestamp,
                details={
                    "amount": txn.amount,
                    "merchant_id": txn.merchant_id,
                    "device_id": txn.device_id,
                    "ip_id": txn.ip_id,
                    "is_abuse": txn.is_abuse
                }
            )
        )
        
    return timeline
