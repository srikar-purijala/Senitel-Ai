from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from app.db.base_class import Base

class Edge(Base):
    __tablename__ = "edges"

    id = Column(String, primary_key=True, index=True) # UUID
    source_entity_id = Column(String, ForeignKey("entities.id"), index=True)
    target_entity_id = Column(String, ForeignKey("entities.id"), index=True)
    relationship_type = Column(String, index=True, nullable=False) # e.g., USES, CONNECTS_FROM, PAYS_WITH
    weight = Column(Float, default=1.0)
    timestamp = Column(DateTime, nullable=True)
