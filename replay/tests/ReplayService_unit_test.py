import pytest
from unittest.mock import MagicMock
from services.service import ReplayService
from util.result import ServiceResponseSuccess, ServiceResponseError, ServiceResponsePage
from repository.ReplayRepository import ReplayRepository
from schemas.parsed_replay import DetailedReplay, ReplayHeader
import json 

@pytest.fixture()
def mock_replay_repository():
    yield MagicMock(spec=ReplayRepository)

@pytest.fixture()
def replay():
    with open('tests/resources/replay.json', 'r') as f:
        yield json.load(f)

def test_available_filters():
    # Arrange
    expected = {
        "name": "gameMetadata.name",
        "map": "gameMetadata.map",
        "gameMode": "gameMetadata.playlist",
        "teamSize": "gameMetadata.teamSize",
        "players": "players",
        "length": "gameMetadata.length",
        "region": "gameMetadata.serverName",
        "date": "gameMetadata.time"
    }
    # Act
    result = ReplayService.available_filters()
    # Assert
    assert result == expected

def test_helper_field_mapper():
    # Arrange
    query = {
        "name": "test",
        "map": "test",
        "gameMode": "test",
        "teamSize": 1,
        "players": "test",
        "length": 1,
        "region": "test",
        "date": 13371337
    }
    expected = {
        "gameMetadata.name": {"$regex": f".*{query['name']}.*", "$options": "i"},
        "gameMetadata.map": {"$regex": f".*{query['map']}.*", "$options": "i"},
        "gameMetadata.playlist": {"$regex": f".*{query['gameMode']}.*", "$options": "i"},
        "gameMetadata.teamSize": {"$gt": query['teamSize'], "$lt": query['teamSize']},
        "players": {"$elemMatch": {"id.id": query['players']}},
        "gameMetadata.length": {"$lte": query['length']},
        "gameMetadata.serverName": {"$regex": f"^{query['region']}$", "$options": "i"},
        "gameMetadata.time": {"$lte": query['date']}
    }
    # Act
    result = {ReplayService.available_filters().get(key): 
              ReplayService._field_mapper(ReplayService.available_filters().get(key), value) 
              for key, value in query.items()}
    # Assert
    assert result == expected

def test_helper_fail_field_mapper():
    # Arrange
    query = {
        "nameField": "test",
        "mapName": "test",
        "gameType": "test",
    }
    
    expected = {None: None}

    # Act
    result = {ReplayService.available_filters().get(key):
                ReplayService._field_mapper(ReplayService.available_filters().get(key), value)
                for key, value in query.items()}
    # Assert
    assert result == expected

def test_get_replay(mock_replay_repository, replay):
    # Arrange
    REPLAY_ID = replay['gameMetadata']['id']
    expected = DetailedReplay(**replay).dict(by_alias=True)
    mock_replay_repository.get.return_value = expected
    # Act
    result = ReplayService(mock_replay_repository).get_replay(REPLAY_ID)
    # Assert
    assert isinstance(result, ServiceResponseSuccess)
    assert result.data[0] == DetailedReplay(**expected)

def test_get_replay_not_found(mock_replay_repository):
    # Arrange
    REPLAY_ID = "123"
    mock_replay_repository.get.return_value = None
    # Act
    result = ReplayService(mock_replay_repository).get_replay(REPLAY_ID)
    # Assert
    assert isinstance(result, ServiceResponseError)
    assert result.error == "Replay not found"

def test_get_replays(mock_replay_repository, replay):
    # Arrange
    replays = [replay, replay, replay]
    replayHeader = replay['gameMetadata']
    expected = [ReplayHeader(**replay).dict(by_alias=True) for replay in 
                [replayHeader, replayHeader, replayHeader]
                ]
    mock_replay_repository.paginate_filter.return_value = replays
    # Act
    result = ReplayService(mock_replay_repository).get_replays()
    # Assert
    assert isinstance(result, ServiceResponsePage)
    assert result.page == 0
    assert result.total == len(expected)
    assert len(result.data) == len(expected)

    for i in range(0, len(expected)):
        assert isinstance(result.data[i], ReplayHeader)
        assert result.data[i] == expected[i]

def test_search(mock_replay_repository):
    assert True

def test_add_replay(mock_replay_repository):
    assert True

def test_update_replay(mock_replay_repository):
    # Arrange
    REPLAY_ID = "123"
    mock_replay_repository.update.return_value = True
    # Act
    result = ReplayService(mock_replay_repository).update_replay(REPLAY_ID, {"name": "test"})
    # Assert
    assert isinstance(result, ServiceResponseSuccess)

def test_delete_replay(mock_replay_repository, replay):
    # Arrange
    REPLAY_ID = replay['gameMetadata']['id']
    mock_replay_repository.delete.return_value = 1
    # Act
    result = ReplayService(mock_replay_repository).delete_replay(REPLAY_ID)
    # Assert
    assert isinstance(result, ServiceResponseSuccess)
    assert result.data[0] == {"result": 1}


def test_get_replays_count(mock_replay_repository):
    # Arrange
    expected = 10
    mock_replay_repository.count.return_value = expected

    # Act
    result = ReplayService(mock_replay_repository).get_replays_count()

    # Assert
    assert isinstance(result, ServiceResponseSuccess)
    assert result.data[0] == {"count": expected}