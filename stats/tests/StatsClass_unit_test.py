import pytest
from unittest.mock import patch
from services.service import StatsClass
from schemas.schema import CountSchema

@pytest.fixture()
def mock_database():
    with patch('config.database.Database') as mock:
        yield mock

def test_get_replay_count_all(mock_database):
    # Arrange
    EXPECTED_VALUE = 12
    mock_database.get_replay_count_all.return_value = EXPECTED_VALUE 
    expected = CountSchema(count=EXPECTED_VALUE)
    # Act
    result = StatsClass(mock_database).get_replay_count_all()
    # Assert
    assert result.count == expected.count