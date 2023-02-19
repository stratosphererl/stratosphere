from fastapi import APIRouter
from services.service import StatsClass
from util.result import ServiceResponse

router = APIRouter()

# @router.get("/")
# def home():
#     result = ServiceExample().get_example(2121)
#     return result
    
### TODO: Add more routes here ###

@router.get("/replays/all")
def get_replay_count_all():
    return StatsClass().get_replay_count_all()

@router.get("/users/all")
def get_user_count_all():
    return StatsClass().get_user_count_all()

@router.get("/replays/test")
def get_replay_count_test(low_rank: int = 0, high_rank: int = 22):
    return StatsClass().get_replay_count_test(low_rank, high_rank)