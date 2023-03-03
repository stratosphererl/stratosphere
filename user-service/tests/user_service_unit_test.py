import pytest
from unittest.mock import patch, PropertyMock
from services.service import UserService
from schemas.schema import UserSchema
from loguru import logger

MOCK_USER_DATA: dict = {
  "id": 1,
  "platform": "steam",
  "username": "gbarns0",
  "date_created": "2022-10-15",
  "number_of_replays": 35,
  "wins": 547,
  "losses": 713,
  "total_goals": 3597,
  "total_assists": 5270,
  "total_saves": 8655,
  "total_shots": 3073
}

# @pytest.fixture
# def mock_database():
#   with patch("config.database.Database") as mock:
#     yield mock

class mock_db_class:
  def get_user(self, _: int):
    return tuple(MOCK_USER_DATA.values())

def test_get_user():
  with patch('services.service.UserService.db', new_callable=PropertyMock) as db_mock:
    db_mock.return_value = mock_db_class()
    user = UserService(None).get_user(1)
  assert isinstance(user, UserSchema)
  assert user.__dict__ == MOCK_USER_DATA
