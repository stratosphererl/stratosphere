from fastapi import APIRouter
from services.service import ServiceExample, UserService
from util.result import ServiceResponse
from enum import Enum

router = APIRouter()

@router.get("/")
def home():
    result = ServiceExample().get_example(2121)
    return result
    
### TODO: Add more routes here ###

class Platform(str, Enum):
    STEAM = "steam"
    EPIC = "epic"
    BOTH = "both"

@router.get("/users")
def users(skip: int = 0, limit: int = 10, platform: Platform = Platform.BOTH, username: str = ""):
    platform = platform.lower()
    
    response = UserService().get_users(skip, limit, platform, username)
    return response