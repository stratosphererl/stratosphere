from fastapi import APIRouter
from services.service import ServiceExample
from util.result import ServiceResponse

router = APIRouter()

# @router.get("/")
# def home():
#     result = ServiceExample().get_example(2121)
#     return result
    
### TODO: Add more routes here ###

@router.get("/replays/all")
def get_replay_count_all():
    return ServiceExample().get_replay_count_all()