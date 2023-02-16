import pytest
from fastapi.testclient import TestClient
from app import app

@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client

def test_foo_integration():
    # Arrange

    # Act
    response = client.get("/")
    
    # Assert
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}