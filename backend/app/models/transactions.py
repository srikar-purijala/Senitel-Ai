from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True) # UUID
    customer_id = Column(String, ForeignKey("entities.id"), index=True)
    merchant_id = Column(String, ForeignKey("entities.id"), index=True)
    payment_instrument_id = Column(String, ForeignKey("entities.id"), index=True)
    device_id = Column(String, ForeignKey("entities.id"), index=True)
    ip_id = Column(String, ForeignKey("entities.id"), index=True)
    
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    timestamp = Column(DateTime, nullable=False, index=True)
    status = Column(String, default="SUCCESS")
    
    # Ground truth for evaluation
    is_abuse = Column(Boolean, default=False)
    network_id = Column(String, nullable=True, index=True) # The abuse ring ID if applicable
