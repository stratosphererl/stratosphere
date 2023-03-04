import pytest
from fastapi.testclient import TestClient
from app import app

@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client

def test_get_replay_count_all_integration(client):
    response = client.get("api/v1/replays/all")
    assert response.status_code == 200
    assert response.json()["count"] == 56 # Is dictionary object

def test_get_replay_count_arena_integration(client):
    ### Checking Exceptions ###
    pass