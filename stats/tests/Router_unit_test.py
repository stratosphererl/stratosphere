from schemas.schema import CountSchema
import routers.router as routes
import tests.lists.exception_lists as excl

import tests.lists.expected_lists as expl
import tests.lists.input_lists as iptl
import tests.lists.invalid_lists as ivdl
import tests.lists.resulting_lists as resl

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
    EXPECTED_VALUES = expl.expected_list_get_replay_count_all()
    RESULTING_VALUES = resl.resulting_list_get_replay_count_all()
    # Testing #
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_arena()
def test_get_replay_count_arena():
    ### Checking Exceptions ###
    # Setup #
    INVALID_VALUES = ivdl.invalid_list_get_replay_count_arena()
    EXPECTED_EXCEPTIONS = excl.exception_list_get_replay_count_arena()
    # Testing #
    check_for_exceptions(routes.get_replay_count_arena, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    ### Checking Results ###
    # Setup #
    EXPECTED_VALUES = expl.expected_list_get_replay_count_arena()
    RESULTING_VALUES = resl.resulting_list_get_replay_count_arena()
    # Testing #
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_duration()
def test_get_replay_count_duration():
    # Exceptions
    INVALID_VALUES = ivdl.invalid_list_get_replay_count_duration()
    EXPECTED_EXCEPTIONS = excl.exception_list_get_replay_count_duration()
    check_for_exceptions(routes.get_replay_count_duration, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = expl.expected_list_get_replay_count_duration()
    RESULTING_VALUES = append_resulting_values(routes.get_replay_count_duration, iptl.input_list_get_replay_count_duration())
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_rank()
def test_get_replay_count_rank():
    # Exceptions
    INVALID_VALUES = ivdl.invalid_list_get_replay_count_rank()
    EXPECTED_EXCEPTIONS = excl.exception_list_get_replay_count_rank()
    check_for_exceptions(routes.get_replay_count_rank, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = expl.expected_list_get_replay_count_rank()
    RESULTING_VALUES = append_resulting_values(routes.get_replay_count_rank, iptl.input_list_get_replay_count_rank())
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_replay_count_season()
def test_get_replay_count_season():
    # Exceptions
    INVALID_VALUES  = ivdl.invalid_list_get_replay_count_season()
    EXPECTED_EXCEPTIONS = excl.exception_list_get_replay_count_season()
    check_for_exceptions(routes.get_replay_count_season, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = expl.expected_list_get_reason_count_season()
    RESULTING_VALUES = append_resulting_values(routes.get_replay_count_season, iptl.input_list_get_replay_count_season())
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_user_count_all()
def test_get_user_count_all():
    # Results
    EXPECTED_VALUES = expl.expected_list_get_user_count_all()
    RESULTING_VALUES = resl.resulting_list_get_user_count_all()
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_user_count_platform()
def test_get_user_count_platform():
    # Exceptions
    INVALID_VALUES = ivdl.invalid_list_get_user_count_platform()
    EXPECTED_EXCEPTIONS = excl.exception_list_get_user_count_platform()
    check_for_exceptions(routes.get_user_count_platform, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = expl.expected_list_get_user_count_platform()
    RESULTING_VALUES = resl.resulting_list_get_user_count_platform()
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)

# Tests router.py get_user_count_rank()
def test_get_user_count_rank():
    # Exceptions
    INVALID_VALUES = ivdl.invalid_list_get_user_count_rank()
    EXPECTED_EXCEPTIONS = excl.exception_list_get_user_count_rank()
    check_for_exceptions(routes.get_user_count_rank, INVALID_VALUES, EXPECTED_EXCEPTIONS)

    # Results
    EXPECTED_VALUES = expl.expected_list_get_user_count_rank()
    RESULTING_VALUES = append_resulting_values(routes.get_user_count_rank, iptl.input_list_get_user_count_rank())
    check_for_equality(RESULTING_VALUES, EXPECTED_VALUES)