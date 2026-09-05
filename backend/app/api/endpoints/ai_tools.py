from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any

from app.api.deps import get_current_user

router = APIRouter()

class AIActionRequest(BaseModel):
    action_type: str = Field(..., description="Action to perform: 'freeze_account', 'escalate', 'request_document'")
    entity_id: str
    reasoning: str

class AIActionResponse(BaseModel):
    status: str
    executed_action: str
    message: str

@router.post("/execute_action", response_model=AIActionResponse)
def execute_ai_action(action: AIActionRequest, current_user = Depends(get_current_user)):
    """
    Structured AI Tool Interface: 
    Strict JSON validation prevents prompt injection mapping directly to DB queries.
    Instead of allowing raw SQL, the LLM emits a defined action schema which the backend executes.
    """
    
    if current_user.role != "ADMIN" and current_user.role != "AI_SYSTEM":
        raise HTTPException(status_code=403, detail="Unauthorized role for AI actions")

    valid_actions = ["freeze_account", "escalate", "request_document"]
    
    if action.action_type not in valid_actions:
        raise HTTPException(status_code=400, detail=f"Invalid action type. Must be one of {valid_actions}")
        
    # Example safe business logic simulation
    return {
        "status": "success",
        "executed_action": action.action_type,
        "message": f"Successfully executed '{action.action_type}' for entity '{action.entity_id}' based on reasoning: {action.reasoning}"
    }
