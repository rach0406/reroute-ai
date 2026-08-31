import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure sys.path points to backend and root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_login_demo():
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["role"] == "Logistics Manager"

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "active_shipments" in data
    assert "network_risk_score" in data

def test_ml_prediction():
    payload = {
        "traffic_level": 0.8,
        "road_condition": 0.4,
        "weather_severity": 0.7,
        "road_capacity": 0.5,
        "historical_delay": 20.0,
        "distance": 12.0
    }
    response = client.post("/api/predict/disruption", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "disruption_probability" in data
    assert "risk_category" in data
    assert len(data["recommendations"]) > 0

def test_route_optimization():
    payload = {
        "source_id": 1,
        "target_id": 5,
        "commodity_priority": "CRITICAL",
        "algorithm": "Dijkstra",
        "objective": "safest"
    }
    response = client.post("/api/routes/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["path_nodes"]) >= 2
    assert "decision_rationale" in data

def test_crisis_simulation():
    response = client.post("/api/disruptions/simulate", json={"crisis_type": "Flash Flood"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["blocked_roads_count"] > 0
