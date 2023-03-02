from services.service import StatsClass

min_arena_num, max_arena_num = StatsClass().get_valid_range("replays_by_arena")

def exception_list_get_replay_count_arena():
    return [ "arena_num does not have a legal value (must be " + str(min_arena_num) + " <= arena_num <= " + str(max_arena_num)] * 3

def exception_list_get_replay_coun_duration():
    return [
        "min_duration does not have a legal value (must be a multiple of 30)",
        "max_duration does not have a legal value (must be a multiple of 30)",
        "min_duration does not have a legal value (must be a positive value)",
        "max_duration does not have a legal value (must be a positive value)"
    ]