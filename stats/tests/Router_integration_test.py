from schemas.schema import CountSchema
import routers.router as routes
import tests.exception_lists as el
import pytest

# Checks that each obtained schema in values is of the same schema type and data value as what is expected (values[0] results in expecteds[0], etc.)
def check_for_equality(values, expecteds):
    for index in range(len(values)):
        assert values[index] == schematize(expecteds[index])

# Checks that when each value in values is passed to method, that it raises the expected exception (values[0] raises exception[0], etc.)
def check_for_exceptions(method, values, exceptions):
    for index in range(len(values)):
        with pytest.raises(Exception) as exception_info:
            if type(values[index]) == int:
                method(values[index])
            else:
                method(values[index][0], values[index][1])

        RESULTING_EXCEPTION = exception_info._excinfo[1]
        EXPECTED_EXCEPTION = Exception(exceptions[index])

        assert type(RESULTING_EXCEPTION) == type(EXPECTED_EXCEPTION)
        assert RESULTING_EXCEPTION.args == EXPECTED_EXCEPTION.args

# Takes input values from input_list, runs them through the provided method, and append the resulting value to return_list, returns that list
def append_resulting_values(method, input_list):
    return_list = []
    for item in input_list:
        if type(item) == int:
            return_list.append(item)
        else:
            return_list.append(method(item[0], item[1]))
    return return_list

# Simply encapsulates the provided value into a CountSchema (value is returned as {count: value})
def schematize(value):
    return CountSchema(count = value)

# Tests router.py get_replay_count_all()
def test_get_replay_count_all():
    ### Checking Results ###
    # Setup #
    EXPECTED_VALUES = [56]
    RESULTING_VALUES = [routes.get_replay_count_all()]
    # Testing #
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_arena()
def test_get_replay_count_arena():
    ### Checking Exceptions ###
    # Setup #
    INVALID_VALUES = [-5432, -1, 6001]
    EXPECTED_EXCEPTIONS = el.exception_list_get_replay_count_arena()
    # Testing #
    check_for_exceptions(routes.get_replay_count_arena, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    ### Checking Results ###
    # Setup #
    EXPECTED_VALUES = [7, 41]
    RESULTING_VALUES = [routes.get_replay_count_arena(x) for x in (3,27)] # Arena nums 3 and 27
    # Testing #
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_duration()
def test_get_replay_count_duration():
    # Exceptions
    INVALID_VALUES = [(27,30), (30,41), (-30, 600), (720, -600)]
    EXPECTED_EXCEPTIONS = el.exception_list_get_replay_count_duration()
    check_for_exceptions(routes.get_replay_count_duration, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = [37, 25, 31, 33, 21, 0]
    RESULTING_VALUES = append_resulting_values(routes.get_replay_count_duration, [(0,1230), (30,1230), (0,360), (0,390), (30,600), (360,300)])
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_rank()
def test_get_replay_count_rank():
    # Exceptions
    INVALID_VALUES = [(-10, 4), (107,2), (4,-1003), (2,234)]
    EXPECTED_EXCEPTIONS = el.exception_list_get_replay_count_rank()
    check_for_exceptions(routes.get_replay_count_rank, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = [56, 53, 15, 33, 51, 8, 4, 0]
    RESULTING_VALUES = append_resulting_values(routes.get_replay_count_rank, [(0,22), (2,22), (17,22), (0,13), (0,20), (10,12), (15,15), (10,9)])
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_season()
def test_get_replay_count_season():
    # Exceptions
    INVALID_VALUES  = [(-7,2),(54,2),(2,-300),(2,909)]
    EXPECTED_EXCEPTIONS = el.exception_list_get_replay_count_season()
    check_for_exceptions(routes.get_replay_count_season, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = [22, 15, 11, 10, 4, 11, 10, 6, 0]
    RESULTING_VALUES = append_resulting_values(routes.get_replay_count_season, [(0,21), (1,21), (11,21), (14,21), (19,21), (0,4), (8,20), (15,15), (7,5)])
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_user_count_all()
def test_get_user_count_all():
    # Results
    EXPECTED_VALUES = [74]
    RESULTING_VALUES = [routes.get_user_count_all()]
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_user_count_platform()
def test_get_user_count_platform():
    # Exceptions
    INVALID_VALUES = [-17, 2, 9001]
    EXPECTED_EXCEPTIONS = el.exception_list_get_user_count_platform()
    check_for_exceptions(routes.get_user_count_platform, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = [41, 33]
    RESULTING_VALUES = [routes.get_user_count_platform(x) for x in (0,1)]
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_user_count_rank()
def test_get_user_count_rank():
    # Exceptions
    INVALID_VALUES = [(-100,2), (100,2), (2,-100), (2,100)]
    EXPECTED_EXCEPTIONS = el.exception_list_get_user_count_rank()
    check_for_exceptions(routes.get_user_count_rank, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = [48, 40, 38, 19, 17, 13, 0]
    RESULTING_VALUES = append_resulting_values(routes.get_user_count_rank, [(0,22), (1,22), (10,22), (21,22), (22,22), (11,11), (4,2)])
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)