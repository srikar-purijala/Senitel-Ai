from sqlalchemy import Column, String, DateTime
from app.db.base_class import Base

class Entity(Base):
    __tablename__ = "entities"
    
    id = Column(String, primary_key=True, index=True) # UUID string
    entity_type = Column(String, index=True, nullable=False) # CUSTOMER, DEVICE, IP, ADDRESS, PAYMENT_INSTRUMENT, MERCHANT
    entity_value = Column(String, index=True, nullable=False)
    first_seen = Column(DateTime, nullable=True)
    last_seen = Column(DateTime, nullable=True)
    
    # Optional flags for ground truth
    is_synthetic = Column(String, default="true")
