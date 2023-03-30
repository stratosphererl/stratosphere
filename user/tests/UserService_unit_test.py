import pytest
from unittest.mock import patch, PropertyMock
from services.service import UserService
from schemas.schema import UserSchema
from loguru import logger

from typing import List

MOCK_USER_DATA: List[dict] = [{
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
}, {
  "id": 2,
  "platform": "steam",
  "username": "jgibson1",
  "date_created": "2023-2-10",
  "number_of_replays": 56,
  "wins": 324,
  "losses": 888,
  "total_goals": 4536,
  "total_assists": 5435,
  "total_saves": 7657,
  "total_shots": 6575
}, {
  "id": 3,
  "platform": "epic",
  "username": "baggins2",
  "date_created": "2022-8-25",
  "number_of_replays": 23,
  "wins": 234,
  "losses": 224,
  "total_goals": 500,
  "total_assists": 1012,
  "total_saves": 843,
  "total_shots": 1503
}]

class mock_db_class:
  def get_users(self, _: dict):
    return [tuple(x.values()) for x in MOCK_USER_DATA]

  def get_user(self, _: int):
    return tuple(MOCK_USER_DATA[0].values())
  
  def create_user(self, _: dict):
    return True
  
  def update_user(self, _: tuple, __: int):
    return True
  
  def delete_user(self, _: int):
    return tuple(MOCK_USER_DATA[0].values())

@pytest.fixture
def mock_database():
  with patch("services.service.UserService.db", new_callable=PropertyMock) as mock:
    mock.return_value = mock_db_class()
    yield mock

def test_get_user(mock_database):
  user = UserService(None).get_user(1)
  assert isinstance(user, UserSchema)
  assert user.__dict__ == MOCK_USER_DATA[0]

def test_get_users(mock_database):
  users = UserService(None).get_users({})
  assert isinstance(users, list)
  for i, user in enumerate(users):
    assert isinstance(user, UserSchema)
    assert user.__dict__ == MOCK_USER_DATA[i]

def test_create_user(mock_database):
  user = UserService(None).create_user({"id": 4, "platform": "epic", "username": "chilibean32"})
  assert isinstance(user, UserSchema)
  
  user_dict = user.__dict__
  user_dict.pop("date_created")
  assert user.__dict__ == {"id": 4, "platform": "epic", "username": "chilibean32", "number_of_replays": 0, "wins": 0, 
                           "losses": 0, "total_goals": 0, "total_assists": 0, "total_saves": 0, "total_shots": 0}
  
def test_update_user(mock_database):
  with patch("services.service.UserService.get_user", return_value=UserSchema(**MOCK_USER_DATA[0])) as mock:
    user = UserService(None).update_user({"total_shots": 1}, 1)
    
  assert isinstance(user, UserSchema)

  mock_data_0_copy = MOCK_USER_DATA[0].copy()
  mock_data_0_copy["total_shots"] = 1
  assert user.__dict__ == mock_data_0_copy

def test_delete_user(mock_database):
  user = UserService(None).delete_user(1)
  assert isinstance(user, UserSchema)
  assert user.__dict__ == MOCK_USER_DATA[0]
