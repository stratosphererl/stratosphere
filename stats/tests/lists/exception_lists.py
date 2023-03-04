from services.service import StatsClass

min_arena_num, max_arena_num = StatsClass().get_valid_range("replays_by_arena")
min_rank_num, max_rank_num = StatsClass().get_valid_range("replays_by_rank")
min_season_num, max_season_num = StatsClass().get_valid_range("replays_by_season")
min_platform_num, max_platform_num = StatsClass().get_valid_range("users_by_platform")

def exception_list_get_replay_count_arena():
    return [ "arena_num does not have a legal value (must be " + str(min_arena_num) + " <= arena_num <= " + str(max_arena_num)] * 3

def exception_list_get_replay_count_duration():
    return [
        "min_duration does not have a legal value (must be a multiple of 30)",
        "max_duration does not have a legal value (must be a multiple of 30)",
        "min_duration does not have a legal value (must be a positive value)",
        "max_duration does not have a legal value (must be a positive value)"
    ]

def exception_list_get_replay_count_rank():
    return [
        "low_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num),
        "low_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num),
        "high_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num),
        "high_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num)
    ]

def exception_list_get_replay_count_season():
    return [
        "low_season_num does not have a legal value (must be >= %d AND <= %d)" % (min_season_num, max_season_num),
        "low_season_num does not have a legal value (must be >= %d AND <= %d)" % (min_season_num, max_season_num),
        "high_season_num does not have a legal value (must be >= %d AND <= %d)" % (min_season_num, max_season_num),
        "high_season_num does not have a legal value (must be >= %d AND <= %d)" % (min_season_num, max_season_num)
    ]

def exception_list_get_user_count_platform():
    return ["platform_num does not have a legal value (must be >= %d AND <= %d)" % (min_platform_num, max_platform_num)] * 3

def exception_list_get_user_count_rank():
    return exception_list_get_replay_count_rank()