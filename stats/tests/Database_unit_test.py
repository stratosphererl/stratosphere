# from unittest.mock import patch
from config.database import Database
# import pytest

# @pytest.fixture()
# def mock_database():
#     with patch('config.database.Database') as mock:
#         yield mock

def test_get_replay_count_all():
    EXPECTED_VALUES = [56]
    assert db.get_replay_count_all() == EXPECTED_VALUES[0] # Total count == 56

def test_get_replay_count_arena():
    EXPECTED_VALUES = [7, 41, 48]
    assert db.get_replay_count_arena(3) == EXPECTED_VALUES[0] # Arena num 3 count == 7
    assert db.get_replay_count_arena(27) == EXPECTED_VALUES[1] # Arena num 28 count == 41
    assert db.get_replay_count_arena(3) + db.get_replay_count_arena(27) == EXPECTED_VALUES[2] # Adding previous two == 48

def test_get_replay_count_duration():
    EXPECTED_VALUES = [37, 25, 31, 33, 21, 0]
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 1230) == EXPECTED_VALUES[0] # Total count == 37
    assert db.get_replay_count_duration(min_duration = 30, max_duration = 1230) == EXPECTED_VALUES[1] # Duration > 30s count == 25
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 360) == EXPECTED_VALUES[2] # Duration < 360s count == 31
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 390) == EXPECTED_VALUES[3] # Duration  390s count == 33
    assert db.get_replay_count_duration(min_duration = 30, max_duration = 600) == EXPECTED_VALUES[4] # Duration 30s <= d < 600s == 21
    assert db.get_replay_count_duration(min_duration = 360, max_duration = 300) == EXPECTED_VALUES[5] # min > max, returns 0

def test_get_replay_count_rank():
    EXPECTED_VALUES = [56, 53, 15, 33, 51, 8, 4, 0]
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 22) == EXPECTED_VALUES[0] # Total count == 56
    assert db.get_replay_count_rank(low_rank_num = 2, high_rank_num = 22) == EXPECTED_VALUES[1] # Bronze II and up count == 53
    assert db.get_replay_count_rank(low_rank_num = 17, high_rank_num = 22) == EXPECTED_VALUES[2] # Champ II and up count == 15
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 13) == EXPECTED_VALUES[3] # Diamond I and below count == 33
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 20) == EXPECTED_VALUES[4] # GrandChamp II and below count == 51
    assert db.get_replay_count_rank(low_rank_num = 10, high_rank_num = 12) == EXPECTED_VALUES[5] # Any platinum rank count == 8
    assert db.get_replay_count_rank(low_rank_num = 15, high_rank_num = 15) == EXPECTED_VALUES[6] # Diamond III count = 4
    assert db.get_replay_count_rank(low_rank_num = 10, high_rank_num = 9) == EXPECTED_VALUES[7] # low > high, returns 0

def test_get_replay_count_season():
    EXPECTED_VALUES = [22, 15, 11, 10, 4, 11, 10, 6]
    assert db.get_replay_count_season(low_season_num = 0, high_season_num = 21) == EXPECTED_VALUES[0] # Total count == 2
    assert db.get_replay_count_season(low_season_num = 1, high_season_num = 21) == EXPECTED_VALUES[1] # Legacy 2 and onwards count == 15
    assert db.get_replay_count_season(low_season_num = 11, high_season_num = 21) == EXPECTED_VALUES[2] # Legacy 12 and onwards count == 11
    assert db.get_replay_count_season(low_season_num = 14, high_season_num = 21) == EXPECTED_VALUES[3] # Free-to-Play count == 10
    assert db.get_replay_count_season(low_season_num = 19, high_season_num = 21) == EXPECTED_VALUES[4] # FtP 6 and onwards count == 4
    assert db.get_replay_count_season(low_season_num = 0, high_season_num = 4) == EXPECTED_VALUES[5] # Legacy 5 and backwards count == 11
    assert db.get_replay_count_season(low_season_num = 8, high_season_num = 20) == EXPECTED_VALUES[6] # Legacy 9 to FtP 7 count == 10
    assert db.get_replay_count_season(low_season_num = 15, high_season_num = 15) == EXPECTED_VALUES[7] # FtP 2 count == 6

def test_get_user_count_all():
    EXPECTED_VALUES = [74]
    assert db.get_user_count_all() == EXPECTED_VALUES[0] # Total count == 74

def test_get_user_count_platform():
    EXPECTED_VALUES = [41, 33]
    assert db.get_user_count_platform(0) == EXPECTED_VALUES[0] # Steam user count == 41
    assert db.get_user_count_platform(1) == EXPECTED_VALUES[1] # Epic Games user count == 33

def test_get_user_count_rank():
    EXPECTED_VALUES = [48, 40, 38, 19, 17, 13, 0]
    assert db.get_user_count_rank(low_rank_num = 0, high_rank_num = 22) == EXPECTED_VALUES[0] # Total count == 48
    assert db.get_user_count_rank(low_rank_num = 1, high_rank_num = 22) == EXPECTED_VALUES[1] # Bronze I and above count == 40
    assert db.get_user_count_rank(low_rank_num = 10, high_rank_num = 22) == EXPECTED_VALUES[2] # Plat I and above count == 38
    assert db.get_user_count_rank(low_rank_num = 21, high_rank_num = 22) == EXPECTED_VALUES[3] # GC III to SSL count == 19
    assert db.get_user_count_rank(low_rank_num = 22, high_rank_num = 22) == EXPECTED_VALUES[4] # SSL count == 17
    assert db.get_user_count_rank(low_rank_num = 11, high_rank_num = 11) == EXPECTED_VALUES[5] # Plat II count == 13
    assert db.get_user_count_rank(low_rank_num = 4, high_rank_num = 2) == EXPECTED_VALUES[6] # low > high, returns 0

db = Database(test = True)