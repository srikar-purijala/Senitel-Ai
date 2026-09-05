from sqlalchemy import Column, String, Float, DateTime, Boolean
from app.db.base_class import Base

class Network(Base):
    __tablename__ = "networks"

    id = Column(String, primary_key=True, index=True) # UUID
    scenario_type = Column(String, index=True, nullable=False) # e.g., NORMAL, PROMO_ABUSE, CORPORATE
    is_abuse = Column(Boolean, default=False)
    status = Column(String, default="ACTIVE") # ACTIVE, UNDER_REVIEW, RESTRICTED, LEGITIMATE, RESOLVED
    created_at = Column(DateTime, nullable=True)
    
class NetworkEntity(Base):
    __tablename__ = "network_entities"

    network_id = Column(String, primary_key=True, index=True)
    entity_id = Column(String, primary_key=True, index=True)
