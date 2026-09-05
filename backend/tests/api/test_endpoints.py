import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.main import app
from app.db.base_class import Base
from app.db.session import get_db
from scripts.generate_data import generate_normal_behavior, generate_promo_abuse_ring
from app.models import *

from sqlalchemy.pool import StaticPool

TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def test_db():
    from app.models.entities import Entity
    from app.models.relationships import Edge
    from app.models.transactions import Transaction
    from app.models.networks import Network, NetworkEntity
    
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    generate_promo_abuse_ring(db, size=5)
    db.commit()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module")
def admin_token():
    response = client.post("/api/auth/login", data={"username": "admin", "password": "admin"})
    return response.json()["access_token"]

def test_login_success():
    response = client.post("/api/auth/login", data={"username": "admin", "password": "admin"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_fail():
    response = client.post("/api/auth/login", data={"username": "admin", "password": "wrong"})
    assert response.status_code == 401

def test_get_networks(test_db, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/networks/", headers=headers)
    assert response.status_code == 200
    networks = response.json()
    assert len(networks) > 0

def test_get_network_graph(test_db, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    net = test_db.query(Network).first()
    
    response = client.get(f"/api/networks/{net.id}/graph", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) > 0

def test_investigation_resolve_rbac(test_db, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    net = test_db.query(Network).first()
    
    response = client.post(f"/api/investigations/{net.id}/resolve?resolution=SUSPICIOUS", headers=headers)
    assert response.status_code == 200
    
    # Try without token
    response_unauth = client.post(f"/api/investigations/{net.id}/resolve?resolution=SUSPICIOUS")
    assert response_unauth.status_code == 401

def test_timeline_endpoint(test_db, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    net = test_db.query(Network).first()
    response = client.get(f"/api/timeline/{net.id}/timeline", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_ai_tools_endpoint(test_db, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "action_type": "freeze_account",
        "entity_id": "CUST-1234",
        "reasoning": "High risk detected"
    }
    response = client.post("/api/ai/execute_action", headers=headers, json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_ai_tools_invalid_action(test_db, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "action_type": "DROP_TABLE",
        "entity_id": "CUST-1234",
        "reasoning": "Injection attempt"
    }
    response = client.post("/api/ai/execute_action", headers=headers, json=payload)
    assert response.status_code == 400
