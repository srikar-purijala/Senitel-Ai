from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str

class NetworkOut(BaseModel):
    id: str
    scenario_type: str
    is_abuse: bool
    status: Optional[str] = "ACTIVE"
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class GraphNode(BaseModel):
    id: str
    entity_type: str
    entity_value: Optional[str] = None
    is_synthetic: Optional[str] = None

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship_type: str
    weight: float

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class EvidenceOut(BaseModel):
    network_id: str
    risk_score: float
    shap_values: Dict[str, float]

class AIInvestigationRequest(BaseModel):
    prompt: Optional[str] = None

class AIInvestigationResponse(BaseModel):
    summary: str
    confidence: str
    recommended_action: str
