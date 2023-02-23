from fastapi import APIRouter
from services.service import ReplayService

router = APIRouter()

@router.get("/")
def home():
    result = ReplayService().get_replays()
    return result

@router.get("/replays")
def get_replays():
    pass

@router.get("/replays/{id}")
def get_replay_by_id():
    pass

@router.get("/replays/user/{user_id}")
def get_user_replay():
    pass

@router.post("/replays")
def post_replay():
    pass

@router.delete("/replays/{id}")
def delete_replay_by_id():
    pass

@router.put("/replays/{id}")
def update_replay_by_id():
    pass


### TODO: Add more routes here ###