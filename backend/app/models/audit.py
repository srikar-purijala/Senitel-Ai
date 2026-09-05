from sqlalchemy import Column, String, DateTime
from app.db.base_class import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    action = Column(String, nullable=False)
    resource_id = Column(String, nullable=True)
    timestamp = Column(DateTime, nullable=False)
    details = Column(String, nullable=True)
