import pytest
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.base_class import Base
from app.models.entities import Entity
from app.models.transactions import Transaction
from app.models.relationships import Edge
from scripts.generate_data import generate_normal_behavior, generate_promo_abuse_ring, generate_legitimate_corporate

# Use an in-memory SQLite database for testing
TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_generate_normal_behavior(db):
    generate_normal_behavior(db, num_customers=10)
    db.commit()
    
    customers = db.query(Entity).filter(Entity.entity_type == "CUSTOMER").all()
    assert len(customers) >= 10
    
    # Check that normal transactions are not marked as abuse
    abuse_txns = db.query(Transaction).filter(Transaction.is_abuse == True).count()
    assert abuse_txns == 0

def test_generate_promo_abuse_ring(db):
    generate_promo_abuse_ring(db, size=10)
    db.commit()
    
    # We generated 10 customers in an abuse ring
    abuse_txns = db.query(Transaction).filter(Transaction.is_abuse == True).all()
    assert len(abuse_txns) == 10
    assert abuse_txns[0].network_id is not None
    
    # Check that device reuse happened
    abuse_customer_ids = [txn.customer_id for txn in abuse_txns]
    edges = db.query(Edge).filter(
        Edge.source_entity_id.in_(abuse_customer_ids),
        Edge.relationship_type == "USES"
    ).all()
    
    used_devices = set([edge.target_entity_id for edge in edges])
    # 10 customers should be sharing a few devices, specifically 3 generated devices
    assert len(used_devices) <= 3

def test_generate_legitimate_corporate(db):
    generate_legitimate_corporate(db, size=15)
    db.commit()
    
    # Corporate txns shouldn't be abuse
    # But they share a single IP
    edges = db.query(Edge).filter(Edge.relationship_type == "CONNECTS_FROM").all()
    # Find IPs that are highly shared
    ip_counts = {}
    for edge in edges:
        ip_counts[edge.target_entity_id] = ip_counts.get(edge.target_entity_id, 0) + 1
        
    assert any(count >= 15 for count in ip_counts.values())
