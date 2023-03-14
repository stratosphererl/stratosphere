from fastapi import APIRouter, Depends, HTTPException
from services.service import StatsClass
# from util.result import ServiceResponse

router = APIRouter()

### Variables for allowing only valid values ###
min_arena_num, max_arena_num = StatsClass().get_valid_range("replays_by_arena")
min_rank_num, max_rank_num = StatsClass().get_valid_range("replays_by_rank")
min_season_num, max_season_num = StatsClass().get_valid_range("replays_by_season")
min_platform_num, max_platform_num = StatsClass().get_valid_range("users_by_platform")

### Public GET routes ###

@router.get("/replays/all")
def get_replay_count_all(var1 = Depends(StatsClass)):
    return StatsClass().get_replay_count_all()

@router.get("/replays/arena")
def get_replay_count_arena(arena_num: int = -1):
    if (arena_num < min_arena_num) or (arena_num > max_arena_num):
        raise HTTPException(400, "arena_num does not have a legal value (must be " + str(min_arena_num) + " <= arena_num <= " + str(max_arena_num))
    return StatsClass().get_replay_count_arena(arena_num)

@router.get("/replays/duration")
def get_replay_count_duration(min_duration: int = 0, max_duration: int = 1230):
    if (min_duration % 30 != 0):
        raise HTTPException(400, "min_duration does not have a legal value (must be a multiple of 30)")
    elif (max_duration % 30 != 0):
        raise HTTPException(400, "max_duration does not have a legal value (must be a multiple of 30)")
    elif (min_duration < 0):
        raise HTTPException(400, "min_duration does not have a legal value (must be a positive value)")
    elif (max_duration < 0):
        raise HTTPException(400, "max_duration does not have a legal value (must be a positive value)")
    else:
        return StatsClass().get_replay_count_duration(min_duration, max_duration)

@router.get("/replays/rank")
def get_replay_count_rank(low_rank_num: int = min_rank_num, high_rank_num: int = max_rank_num):
    legal_nums = range(min_rank_num, max_rank_num + 1)
    if (low_rank_num not in legal_nums):
        raise HTTPException(400, "low_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num))
    elif (high_rank_num not in legal_nums):
        raise HTTPException(400, "high_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num))
    else:
        return StatsClass().get_replay_count_rank(low_rank_num, high_rank_num)

@router.get("/replays/season") # Season of replay, may not be used
def get_replay_count_season(low_season_num: int = min_season_num, high_season_num: int = max_season_num):
    legal_nums = range(min_season_num, max_season_num + 1)
    if (low_season_num not in legal_nums):
        raise HTTPException(400, "low_season_num does not have a legal value (must be >= %d AND <= %d)" % (min_season_num, max_season_num))
    elif (high_season_num not in legal_nums):
        raise HTTPException(400, "high_season_num does not have a legal value (must be >= %d AND <= %d)" % (min_season_num, max_season_num))
    else:
        return StatsClass().get_replay_count_season(low_season_num, high_season_num)

@router.get("/users/all")
def get_user_count_all():
    return StatsClass().get_user_count_all()

@router.get("/users/platform")
def get_user_count_platform(platform_num: int = -1):
    legal_nums = range(min_platform_num, max_platform_num + 1)
    if (platform_num not in legal_nums):
        raise HTTPException(400, "platform_num does not have a legal value (must be >= %d AND <= %d)" % (min_platform_num, max_platform_num))
    else:
        return StatsClass().get_user_count_platform(platform_num)
    
@router.get ("/users/rank") # Rank of user, may not be used due to a user not having a single rank
def get_user_count_rank(low_rank_num: int = min_rank_num, high_rank_num: int = max_rank_num):
    legal_nums = range(min_rank_num, max_rank_num + 1)
    if (low_rank_num not in legal_nums):
        raise HTTPException(400, "low_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num))
    elif (high_rank_num not in legal_nums):
        raise HTTPException(400, "high_rank_num does not have a legal value (must be >= %d AND <= %d)" % (min_rank_num, max_rank_num))
    else:
        return StatsClass().get_user_count_rank(low_rank_num, high_rank_num)
    
### Private PUT methods ###

