import pytest
from unittest.mock import patch
from services.service import StatsClass
from schemas.schema import CountSchema
from config.database import Database

@pytest.fixture()
def mock_database():
    with patch('config.database.Database') as mock:
        yield mock

EXPECTED_VALUE = 12
expected = CountSchema(count = EXPECTED_VALUE)

def count_assert_helper(result):
    assert result.count == expected.count

def test_get_replay_count_all(mock_database):
    mock_database.get_replay_count_all.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_replay_count_all()
    count_assert_helper(result)

def test_get_replay_count_arena(mock_database):
    mock_database.get_replay_count_arena.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_replay_count_arena(4) # Random arena num
    count_assert_helper(result)

def test_get_replay_count_duration(mock_database):
    mock_database.get_replay_count_duration.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_replay_count_duration(0, 60) # Random durations
    count_assert_helper(result)

def test_get_replay_count_rank(mock_database):
    mock_database.get_replay_count_rank.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_replay_count_rank(8, 12) # Random rank nums
    count_assert_helper(result)

def test_get_replay_count_season(mock_database):
    mock_database.get_replay_count_season.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_replay_count_season(17, 18) # Random season nums
    count_assert_helper(result)

def test_get_user_count_all(mock_database):
    mock_database.get_user_count_all.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_user_count_all()
    count_assert_helper(result)

def test_get_user_count_platform(mock_database):
    mock_database.get_user_count_platform.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_user_count_platform(1) # Random platform num
    count_assert_helper(result)

def test_get_user_count_rank(mock_database):
    mock_database.get_user_count_rank.return_value = EXPECTED_VALUE
    result = StatsClass(mock_database).get_user_count_rank(10, 13) # Random rank nums
    count_assert_helper(result)

def test_get_valid_range(mock_database):
    db = Database(test = True)
    result_platform = db.get_valid_range("users_by_platform")
    result_rank = db.get_valid_range("replays_by_rank")
    assert result_platform == set([0,1])
    assert result_rank == set([0,22])
    