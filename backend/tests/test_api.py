import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "MediFind API"}

def test_get_medicines():
    response = client.get("/api/v1/medicines")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "name" in data[0]
        assert "genericName" in data[0]

def test_search_medicines():
    response = client.get("/api/v1/medicines/search?q=Paracetamol")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_pharmacies():
    response = client.get("/api/v1/pharmacies")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_nearby_pharmacies():
    response = client.get("/api/v1/pharmacies/nearby?lat=18.4752&lng=73.8324&radius=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_availability_records():
    response = client.get("/api/v1/availability")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_admin_stats():
    response = client.get("/api/v1/admin/stats")
    assert response.status_code == 200
    data = response.json()
    assert "stats" in data
    assert "searchTrends" in data

def test_user_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "user@medifind.com",
        "password": "password123",
        "role": "user"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["email"] == "user@medifind.com"
