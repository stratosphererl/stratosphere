from schemas.schema import CountSchema
import routers.router as routes
import tests.exception_lists as el
import pytest

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

# Simply encapsulates the provided value into a CountSchema (value is returned as {count: value})
def schematize(value):
    return CountSchema(count = value)

# Tests router.py get_replay_count_all()
def test_get_replay_count_all():
    # Testing for integration results
    EXPECTED_VALUES = [56]
    assert routes.get_replay_count_all() == schematize(EXPECTED_VALUES[0])

# Tests router.py get_replay_count_arena()
def test_get_replay_count_arena():
    ### Checking Exceptions ###
    # Setup #
    INVALID_ARENA_NUMS = [-5432, -1, 6001]
    EXPECTED_EXCEPTIONS = el.exception_list_get_replay_count_arena()
    # Testing #
    check_for_exceptions(routes.get_replay_count_arena, INVALID_ARENA_NUMS, EXPECTED_EXCEPTIONS)

    ### Checking Results ###
    # Setup #
    EXPECTED_VALUES = [7, 41]
    COUNT_SCHEMA_ARENA_3 = routes.get_replay_count_arena(3)
    COUNT_SCHEMA_ARENA_27 = routes.get_replay_count_arena(27)
    # Testing #
    assert COUNT_SCHEMA_ARENA_3 == schematize(EXPECTED_VALUES[0]) # COUNT_SCHEMA_ARENA_3 == {count: 7}
    assert COUNT_SCHEMA_ARENA_27 == schematize(EXPECTED_VALUES[1]) # COUNT_SCHEMA_ARENA_27 == {count: 41}

# Tests router.py get_replay_count_duration()
def test_get_replay_count_duration():
    ### Checking Exceptions ###
    # Setup #
    INVALID_DURATION_VALUES = [(27,30), (30,41), (-30, 600), (720, -600)]
    EXPECTED_EXCEPTIONS = el.exception_list_get_replay_coun_duration()
    # Testing #
    check_for_exceptions(routes.get_replay_count_duration, INVALID_DURATION_VALUES, EXPECTED_EXCEPTIONS)

    ### Checking Results ###
    # Setup #

    # Testing #