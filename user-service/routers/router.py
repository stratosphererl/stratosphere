from fastapi import Depends, APIRouter
from fastapi.security import OAuth2PasswordBearer
from services.service import ServiceExample, UserService
from util.result import ServiceResponse
from enum import Enum
from pydantic import BaseModel

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
def get_users_by_params(skip: int = 0, limit: int = 10, platform: Platform = Platform.BOTH, username: str = ""):
    platform = platform.lower()
    
    return UserService().get_users(skip, limit, platform, username)

@router.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    return UserService().get_user(user_id)

@router.get("/user/{user_id}")
def alt_route_for_user_by_id(user_id: int):
    return get_user_by_id(user_id)
