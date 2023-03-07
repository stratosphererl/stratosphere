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
        # mounts=[
        #     Mount(
        #         source=f"~/{service_name}/tests/setup/",
        #         target="/docker-entrypoint-initdb.d/",
        #         type="bind",
        #         # no_copy=True,
        #         # consistency="delegated",
        #         # propagation="rslave",
        #         read_only=False,
        #     )
        # ],
        # volumes={
        #     # f"~/{service_name}/tests/data": {"bind": "/var/lib/postgres/data", "mode": "rw"},
        #     f"~/{service_name}/tests/setup/": {"bind": "/docker-entrypoint-initdb.d/", "mode": "rw"},
        # },
        # volumes={
        #     volume.id: {"bind": "/docker-entrypoint-initdb.d/", "mode": "rw"},
        # },
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

def test_get_users(database):
    client = TestClient(app)
    response = client.get("/api/v1/users")
    assert response.status_code == 200

def test_get_user_by_id(database):
    client = TestClient(app)
    response = client.get("/api/v1/users/1")
    assert response.status_code == 200
