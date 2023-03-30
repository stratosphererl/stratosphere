import pytest
import os
import docker
from pymongo import MongoClient
import json
import copy

from config.envs import DB_VAR_USER_NAME, DB_VAR_PASSWORD_NAME, DB_VAR_NAME
from repository.ReplayRepository import ReplayRepository
from schemas.parsed_replay import DetailedReplay

@pytest.fixture
def repository(request):
    client = docker.from_env()

    env_vars = {
        "MONGO_INITDB_ROOT_USERNAME": os.environ[DB_VAR_USER_NAME],
        "MONGO_INITDB_ROOT_PASSWORD": os.environ[DB_VAR_PASSWORD_NAME]
    }

    # Start MongoDB Docker container
    mongo_container = client.containers.run(
        image="mongo:latest",
        detach=True,
        environment=env_vars,
        ports={"27017/tcp": ("localhost", 27018)}
    )

    def finalizer():
        mongo_container.stop()
        mongo_container.remove()

    # # Wait for MongoDB to start up
    mongo_client = MongoClient('mongodb://%s:%s@%s:%s' % 
    (
        os.getenv(DB_VAR_USER_NAME), 
        os.getenv(DB_VAR_PASSWORD_NAME), 
        "localhost",
        "27018"
    ))
    mongo_client.server_info()

    yield ReplayRepository(mongo_client[os.environ[DB_VAR_NAME]]['test_collection'])

    request.addfinalizer(finalizer)

@pytest.fixture
def replay():
    with open("replay/tests/resources/replay.json", "r") as replay_file:
        replay = json.load(replay_file)

    return replay

@pytest.fixture
def replays():
    with open("replay/tests/resources/replay.json", "r") as replay_file:
        replay = json.load(replay_file)
    
    replays = []
    for i in range(0, 100):
        replay_copy = copy.deepcopy(replay)
        replay_copy['gameMetadata']['id'] = str(i)
        replays.append(replay_copy)
    
    return replays

def test_paginate(repository, replays):
    # Arrange
    for replay in replays:
         replayFormatted = DetailedReplay(**replay)
         repository.add(replayFormatted)

    # Act
    actual = repository.paginate_filter(0, 10, {})

    # Assert
    assert actual is not None
    assert actual.explain().get("executionStats", {}).get("nReturned") == 10
    
def test_paginate_filter(repository, replays):
    # Arrange
    for replay in replays:
         replayFormatted = DetailedReplay(**replay)
         repository.add(replayFormatted)

    filters = {
        "gameMetadata.id": replays[0]['gameMetadata']['id']
    }

    # Act
    actual = repository.paginate_filter(0, 10, filters)

    # Assert
    assert actual is not None
    assert actual.explain().get("executionStats", {}).get("nReturned") == 1
    assert actual[0]['gameMetadata']['name'] == replays[0]['gameMetadata']['name']

def test_get(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)
    repository.add(replayFormatted)

    # Act
    actual = repository.get('BF04CC604DC7873E642581AE58326498')

    # Assert
    assert replay is not None
    assert actual['_id'] == replay['gameMetadata']['id']

def test_get_fail(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)

    # Act
    with pytest.raises(Exception):
        actual = repository.get('BF04CC604DC7873E642581AE58326498')
        assert True

def test_get_all(repository, replays):
    # Arrange
    for replay in replays:
         replayFormatted = DetailedReplay(**replay)
         repository.add(replayFormatted)

    # Act
    actual = repository.get_all()

    # Assert
    assert actual is not None
    assert actual.explain().get("executionStats", {}).get("nReturned") == len(replays)

def test_add(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)

    # Act
    repository.add(replayFormatted)
    actual = repository.count()

    # Assert
    assert actual == 1

def test_update(repository, replay):
    # Arrange
    replayFormatted : DetailedReplay = DetailedReplay(**replay)
    repository.add(replayFormatted)

    updated_fields = replayFormatted.gameMetadata
    updated_fields.name = "New Name"
    replayFormatted.gameMetadata = updated_fields

    # Act
    result = repository.update(replayFormatted.id, replayFormatted)
    actual = repository.get(replayFormatted.id)

    # Assert
    assert result
    assert actual['gameMetadata']['name'] == "New Name"

def test_update_fail(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)

    # Act
    with pytest.raises(Exception):
        result = repository.update(replayFormatted.id, replayFormatted)
        assert True

def test_delete(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)
    repository.add(replayFormatted)

    # Act
    result = repository.delete(replayFormatted.id)
    actual = repository.count()

    # Assert
    assert result
    assert actual == 0

def test_delete_fail(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)

    # Act
    with pytest.raises(Exception):
        result = repository.delete(replayFormatted.id)
        assert True

def test_search(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)
    repository.add(replayFormatted)
    filters = {
        "gameMetadata.name": replayFormatted.gameMetadata.name
    }

    # Act
    actual = repository.search(filters)

    # Assert
    assert actual is not None
    assert actual.explain().get("executionStats", {}).get("nReturned") == 1
    assert actual[0]['gameMetadata']['name'] == replayFormatted.gameMetadata.name


def test_count(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)
    repository.add(replayFormatted)

    # Act
    actual = repository.count()

    # Assert
    assert actual == 1
    
def test_exists(repository, replay):
    # Arrange
    replayFormatted = DetailedReplay(**replay)
    repository.add(replayFormatted)

    # Act
    actual = repository.exists(replayFormatted.id)

    # Assert
    assert actual