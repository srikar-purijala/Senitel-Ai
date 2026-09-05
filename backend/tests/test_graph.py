import pytest
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.base_class import Base
from app.models.transactions import Transaction
from app.models.entities import Entity
from app.models.relationships import Edge
from scripts.generate_data import generate_promo_abuse_ring, generate_legitimate_corporate, generate_normal_behavior
from app.graph.builder import build_heterogeneous_graph
from app.graph.analysis import extract_subgraphs, compute_network_features

TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Generate behavior
    generate_normal_behavior(db, num_customers=10)
    generate_promo_abuse_ring(db, size=15)
    generate_legitimate_corporate(db, size=20)
    db.commit()
    
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_graph_semantic_properties(db):
    G = build_heterogeneous_graph(db, include_transactions=False)
    subgraphs = extract_subgraphs(G)
    
    # Verify semantic properties across all subgraphs
    abuse_ring_found = False
    corporate_found = False
    
    for sg in subgraphs:
        features = compute_network_features(sg)
        
        # Check if this subgraph contains any abuse-tagged transactions or entities
        # Since include_transactions=False, we check nodes for their ground truth network_id
        # Our generator adds network_id to transactions, not entities directly.
        # But wait, entities don't have network_id in the schema.
        # Let's test properties:
        
        if features["num_customers"] >= 15 and features["device_reuse_ratio"] > 1.5:
            # High device reuse ratio indicates the promo abuse ring (15 users sharing 3 devices)
            abuse_ring_found = True
            
        if features["num_customers"] >= 20 and features["ip_reuse_ratio"] > 1.0 and features["device_reuse_ratio"] <= 1.0:
            # Corporate network (many users, 1 shared IP, different devices)
            corporate_found = True
            
    assert abuse_ring_found, "The promo abuse ring was not correctly represented in the graph logic."
    assert corporate_found, "The legitimate corporate network was not correctly represented in the graph logic."
