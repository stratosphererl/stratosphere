from datetime import datetime
import pytest
import os
from config.envs import *
import docker
from docker.types import Mount
from time import sleep
from fastapi.testclient import TestClient
from app import app
import tarfile
import io


def copy_to_container(container, src: str, dst_dir: str):
    """ src shall be an absolute path """
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode='w|') as tar, open(src, 'rb') as f:
        info = tar.gettarinfo(fileobj=f)
        info.name = os.path.basename(src)
        tar.addfile(info, f)

    container.put_archive(dst_dir, stream.getvalue())

# Environment variables
port = os.getenv(USER_DB_VAR_PORT_NAME)
user = os.getenv(USER_DB_VAR_USER_NAME)
password = os.getenv(USER_DB_VAR_PASSWORD_NAME)
host = os.getenv(USER_DB_VAR_HOST_NAME)
service_name = os.getenv(USER_SERVICE_VAR_NAME)
db_name = os.getenv(USER_DB_VAR_NAME)

# Define a fixture to run a database container
@pytest.fixture(scope="session")
def database(request):
    client = docker.from_env()
    
    database_container = client.containers.create(
        image="amd64/postgres:alpine",
        restart_policy={"name": "always"},
        ports={f"{port}/tcp": port},
        environment={
            "POSTGRES_USER": user,
            "POSTGRES_PASSWORD": password,
            "POSTGRES_DB": host,
        },
        name=db_name,
        detach=True,
    )

    src_path = os.getcwd() + "/tests/setup/init.sql"
    copy_to_container(database_container, src_path, "/docker-entrypoint-initdb.d/")
    database_container.start()

    # Wait for the database to be ready
    timeout = 120
    stop_time = 3
    elapsed_time = 0
    while database_container.status != "running" and elapsed_time < timeout:
        sleep(stop_time)
        elapsed_time += stop_time
        database_container.reload()

    def teardown():
        database_container.stop()
        database_container.remove()
    
    yield database_container

    request.addfinalizer(teardown)

@pytest.fixture(scope="session")
def client():
    client = TestClient(app)
    yield client

# Test basic users
def test_get_users(database, client):
    limit = 10
    response = client.get(f"/api/v1/users?limit={limit}")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 10
    for idx, user in enumerate(users):
        assert user["id"] == idx + 1

# Test get user by id
def test_get_user_by_id(database, client):
    user_id = 5
    response = client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    user = response.json()
    assert user["id"] == user_id

# Test get users with pagination
def test_get_users_with_pagination(database, client):
    limit = 10
    page = 2
    response = client.get(f"/api/v1/users?limit={limit}&page={page}")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == limit
    for idx, user in enumerate(users):
        assert user["id"] == idx + 1 + (page - 1) * limit

# Test get users with user search
def test_get_users_with_user_search(database, client):
    limit = 10
    search = "ad"
    response = client.get(f"/api/v1/users?limit={limit}&username={search}")
    assert response.status_code == 200
    users = response.json()
    assert len(users) <= limit
    for user in users:
        assert search in user["username"]

# Test get users with platform search
def test_get_users_with_platform_search(database, client):
    limit = 10
    platform="steam"
    response = client.get(f"/api/v1/users?limit={limit}&platform={platform}")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 10
    for user in users:
        assert user["platform"] == platform

# Test search not found
def test_search_not_found(database, client):
    limit = 100
    page = 2
    response = client.get(f"/api/v1/users?limit={limit}&page={page}")
    assert response.status_code == 404
    assert response.json()["detail"] == "No users with those parameters could be found!"

# Test not authenticated
def test_not_authenticated(database, client):
    # Post request
    response = client.post("/api/v1/users")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

@pytest.fixture(scope="session")
def authenticated_client():
    client = TestClient(app)
    response = client.post("/api/v1/token", data={"username": "admin", "password": "admin"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})
    yield client

# Test create user
def test_authenticated_actions(database, authenticated_client):
    username = "Chicken935"
    platform = "steam"
    response = authenticated_client.post("/api/v1/users", json={"id": 101, "username": username, "platform": platform})
    assert response.status_code == 201
    user = response.json()
    assert user["id"] == 101
    assert user["username"] == username
    assert user["platform"] == platform
    assert user["date_created"] == datetime.today().strftime('%Y-%m-%d')

    _test_user_update(authenticated_client, 101, username, "Chicken936")
    _test_user_delete(authenticated_client, 101)

def _test_user_update(authenticated_client, user_id, old_username, new_username):
    response = authenticated_client.put(f"/api/v1/users/{user_id}", json={"username": new_username})
    assert response.status_code == 200
    user = response.json()
    assert user["username"] == new_username

def _test_user_delete(authenticated_client, user_id):
    response = authenticated_client.delete(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["id"] == user_id
