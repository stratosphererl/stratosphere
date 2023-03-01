# from unittest.mock import patch
from config.database import Database
# import pytest

# @pytest.fixture()
# def mock_database():
#     with patch('config.database.Database') as mock:
#         yield mock

def test_get_replay_count_all():
    assert db.get_replay_count_all() == 56 # Total number of replays == 56

def test_get_replay_count_arena():
    assert db.get_replay_count_arena(3) == 7 # Number of replays with arena num 3 == 7
    assert db.get_replay_count_arena(27) == 41 # Number of replays with arena num 27 == 41
    assert db.get_replay_count_arena(3) + db.get_replay_count_arena(27) == 48 # Adding the two above values results in value == 48

def test_get_replay_count_duration():
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 1230) == 37 # Number of replays in duration relation == 37
    assert db.get_replay_count_duration(min_duration = 30, max_duration = 1230) == 25 # Number of replays with duration >= 30s == 25
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 360) == 31 # Number of replays with duration < 360s == 31
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 390) == 33 # Number of replays with duration < 390s == 33
    assert db.get_replay_count_duration(min_duration = 30, max_duration = 600) == 21 # Number of replays with 30s <= duration < 600s == 21
    assert db.get_replay_count_duration(min_duration = 360, max_duration = 300) == 0 # Min > Max, should return 0 always

def test_get_replay_count_rank():
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 22) == 56 # Should return the number of all replays which == 56
    assert db.get_replay_count_rank(low_rank_num = 2, high_rank_num = 22) == 53 # Returns number of replays Bronze II and up which == 53
    assert db.get_replay_count_rank(low_rank_num = 17, high_rank_num = 22) == 15 # Returns number of replays Champ II and up which == 15
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 13) == 33 # Returns number of replays Diamond I and below which == 33
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 20) == 51 # Returns number of replays GrandChamp II and below which == 51
    assert db.get_replay_count_rank(low_rank_num = 10, high_rank_num = 12) == 8 # Returns number of all Platinum replays which == 8
    assert db.get_replay_count_rank(low_rank_num = 15, high_rank_num = 15) == 4 # Returns number of all Diamond III replays which == 4
    assert db.get_replay_count_rank(low_rank_num = 10, high_rank_num = 9) == 0 # low_rank_num > high_rank_num, returns 0

def test_get_replay_count_season():
    assert db.get_replay_count_season(low_season_num = 0, high_season_num = 21) == 22 # Should return the number of all replays in relation which == 22
    assert db.get_replay_count_season(low_season_num = 1, high_season_num = 21) == 15 # Returns number of replays from seasons Legacy 2 and onwards which == 15
    assert db.get_replay_count_season(low_season_num = 11, high_season_num = 21) == 11 # Returns the number of replays from season Legacy 12 and onwards which == 11
    assert db.get_replay_count_season(low_season_num = 14, high_season_num = 21) == 10 # Returns the number of replays from any Free-to-Play (FtP) season
    assert db.get_replay_count_season(low_season_num = 19, high_season_num = 21) == 4 # Returns the number of replays from FtP 6 and onwards which == 4
    assert db.get_replay_count_season(low_season_num = 0, high_season_num = 4) == 11 # Returns the number of replays from Legacy 5 and backwards which == 11
    assert db.get_replay_count_season(low_season_num = 8, high_season_num = 20) == 10 # Returns num replays from Legacy 9 to FtP 7 which == 10
    assert db.get_replay_count_season(low_season_num = 15, high_season_num = 15) == 6 # Returns num replays from FtP 2 which == 6

def test_get_user_count_all():
    assert db.get_user_count_all() == 74 # Should return the number of all users which == 74

def test_get_user_count_platform():
    assert db.get_user_count_platform(0) == 41 # Returns the number of our users from the Steam platform
    assert db.get_user_count_platform(1) == 33 # Returns the number of our users from the Epic Games platform

def test_get_user_count_rank():
    assert db.get_user_count_rank(low_rank_num = 0, high_rank_num = 22) == 48 # Should return the total number of users which == 48
    assert db.get_user_count_rank(low_rank_num = 1, high_rank_num = 22) == 40 # Returns the number of users Bronze I and above which == 40
    assert db.get_user_count_rank(low_rank_num = 10, high_rank_num = 22) == 38 # Returns the number of users Platinum I and above which == 38
    assert db.get_user_count_rank(low_rank_num = 21, high_rank_num = 22) == 19 # Returns the number of users GC III or SSL which == 19
    assert db.get_user_count_rank(low_rank_num = 22, high_rank_num = 22) == 17 # Returns the number of users who are SSL == 17
    assert db.get_user_count_rank(low_rank_num = 11, high_rank_num = 11) == 13 # Returns the number of users who are Platinum II which == 13
    assert db.get_user_count_rank(low_rank_num = 4, high_rank_num = 2) == 0 # low_rank_num > high_rank_num, should return 0

db = Database(test = True)