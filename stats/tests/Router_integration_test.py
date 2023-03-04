import pytest
from fastapi.testclient import TestClient
from app import app
import tests.lists.exception_lists as excl
import tests.lists.expected_lists as expl
import tests.lists.input_lists as iptl
import tests.lists.invalid_lists as ivdl
import tests.lists.resulting_lists as resl

GOOD_CODE = 200
BAD_CODE = 400

@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client

def test_get_replay_count_all_integration(client):
    ### Checking Results ###
    response = client.get("api/v1/replays/all")
    assert response.status_code == 200
    assert response.json()["count"] == expl.expected_list_get_replay_count_all()[0]

def test_get_replay_count_arena_integration(client):
    ### Checking Exceptions ###
    INVALID_VALUES = ivdl.invalid_list_get_replay_count_arena()
    for index in range(len(INVALID_VALUES)):
        response = client.get("api/v1/replays/arena?arena_num=" + str(INVALID_VALUES[index]))
        assert response.status_code == BAD_CODE

    ### Checking Results ###
    INPUT_VALUES = iptl.input_list_get_replay_count_arena()
    EXPECTED_RESULTS = expl.expected_list_get_replay_count_arena()
    for index in range(len(INPUT_VALUES)):
        response = client.get("api/v1/replays/arena?arena_num=" + str(INPUT_VALUES[index]))
        assert response.status_code == GOOD_CODE
        assert response.json()["count"] == EXPECTED_RESULTS[index]

def test_get_replay_count_duration_integration(client):
    ### Checking Exceptions ###
    INVALID_VALUES = ivdl.invalid_list_get_replay_count_duration()
    for index in range(len(INVALID_VALUES)):
        response = client.get("api/v1/replays/duration?min_duration=" + str(INVALID_VALUES[index][0]) + "&max_duration=" + str(INVALID_VALUES[index][1]))
        assert response.status_code == BAD_CODE

    ### Checking Results ###
    INPUT_VALUES = iptl.input_list_get_replay_count_duration()
    EXPECTED_RESULTS = expl.expected_list_get_replay_count_duration()
    for index in range(len(INPUT_VALUES)):
        response = client.get("api/v1/replays/duration?min_duration=" + str(INPUT_VALUES[index][0]) + "&max_duration=" + str(INPUT_VALUES[index][1]))
        assert response.status_code == GOOD_CODE
        assert response.json()["count"] == EXPECTED_RESULTS[index]

def test_get_replay_count_rank_integration(client):
    ### Checking Exceptions ###
    INVALID_VALUES = ivdl.invalid_list_get_replay_count_rank()
    for index in range(len(INVALID_VALUES)):
        response = client.get("api/v1/replays/rank?low_rank_num=" + str(INVALID_VALUES[index][0]) + "&high_rank_num=" + str(INVALID_VALUES[index][1]))
        assert response.status_code == BAD_CODE

    ### Checking Results ###
    INPUT_VALUES = iptl.input_list_get_replay_count_rank()
    EXPECTED_RESULTS = expl.expected_list_get_replay_count_rank()
    for index in range(len(INPUT_VALUES)):
        response = client.get("api/v1/replays/rank?low_rank_num=" + str(INPUT_VALUES[index][0]) + "&high_rank_num=" + str(INPUT_VALUES[index][1]))
        assert response.status_code == GOOD_CODE
        assert response.json()["count"] == EXPECTED_RESULTS[index]

def test_get_replay_count_season_integration(client):
    ### Checking Exceptions ###
    INVALID_VALUES = ivdl.invalid_list_get_replay_count_season()
    for index in range(len(INVALID_VALUES)):
        response = client.get("api/v1/replays/season?low_season_num=" + str(INVALID_VALUES[index][0]) + "&high_season_num=" + str(INVALID_VALUES[index][1]))
        assert response.status_code == BAD_CODE

    ### Checking Results ###
    INPUT_VALUES = iptl.input_list_get_replay_count_season()
    EXPECTED_RESULTS = expl.expected_list_get_replay_count_season()
    for index in range(len(INPUT_VALUES)):
        response = client.get("api/v1/replays/season?low_season_num=" + str(INPUT_VALUES[index][0]) + "&high_season_num=" + str(INPUT_VALUES[index][1]))
        assert response.status_code == GOOD_CODE
        assert response.json()["count"] == EXPECTED_RESULTS[index]

def test_get_user_count_all_integration(client):
    ### Checking Results ###
    response = client.get("api/v1/users/all")
    assert response.status_code == 200
    assert response.json()["count"] == expl.expected_list_get_user_count_all()[0]

def test_get_user_count_platform_integration(client):
    ### Checking Exceptions ###
    INVALID_VALUES = ivdl.invalid_list_get_user_count_platform()
    for index in range(len(INVALID_VALUES)):
        response = client.get("api/v1/users/platform?platform_num=" + str(INVALID_VALUES[index]))
        assert response.status_code == BAD_CODE

    ### Checking Results ###
    INPUT_VALUES = iptl.input_list_get_replay_count_platform()
    EXPECTED_RESULTS = expl.expected_list_get_user_count_platform()
    for index in range(len(INPUT_VALUES)):
        response = client.get("api/v1/users/platform?platform_num=" + str(INPUT_VALUES[index]))
        assert response.status_code == GOOD_CODE
        assert response.json()["count"] == EXPECTED_RESULTS[index]

def test_get_user_count_rank_integration(client):
    ### Checking Exceptions ###
    INVALID_VALUES = ivdl.invalid_list_get_user_count_rank()
    for index in range(len(INVALID_VALUES)):
        response = client.get("api/v1/users/rank?low_rank_num=" + str(INVALID_VALUES[index][0]) + "&high_rank_num=" + str(INVALID_VALUES[index][1]))
        assert response.status_code == BAD_CODE

    ### Checking Results ###
    INPUT_VALUES = iptl.input_list_get_user_count_rank()
    EXPECTED_RESULTS = expl.expected_list_get_user_count_rank()
    for index in range(len(INPUT_VALUES)):
        response = client.get("api/v1/users/rank?low_rank_num=" + str(INPUT_VALUES[index][0]) + "&high_rank_num=" + str(INPUT_VALUES[index][1]))
        assert response.status_code == GOOD_CODE
        assert response.json()["count"] == EXPECTED_RESULTS[index]
