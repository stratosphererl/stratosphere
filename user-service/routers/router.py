from fastapi import APIRouter, Path, Query, Body
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel, Field

from services.service import UserService

from dataclasses import dataclass

router = APIRouter()

# Get users based on parameters
@router.get("/users")
def get_users_by_params(
    page: int = Query(default=1, ge=1), 
    limit: int = Query(default=10, ge=1), 
    platform: str = Query(default='both', regex='steam|epic|both'), 
    username: str = Query(default=""),
):
    response = UserService().get_users(dict({
        "page": page,
        "limit": limit,
        "platform": platform,
        "username": username
    }))

    if len(response) == 0:
        return PlainTextResponse(content="No users with those parameters could be found!", status_code=404)
    return JSONResponse(content=[x.__dict__ for x in response], status_code=200)

# Get User by ID
@router.get("/users/{user_id}")
def get_user_by_id(user_id: int = Path(ge=1)):
    response = UserService().get_user(user_id)

    if response is None:
        return PlainTextResponse(content=f"The user with id: {user_id} does not exist!", status_code=404)
    return JSONResponse(content=response.__dict__, status_code=200)

# Create New User
class NewUserInfo(BaseModel):
    id: int = Field(default=..., ge=1)
    platform: str = Field(default=..., regex='steam|epic')
    username: str = Field(default=...)
@router.post("/users")
def create_user(user: NewUserInfo = Body()):
    response = UserService().create_user(user.dict())
    
    if response is None:
        return PlainTextResponse(content="This user already exists and thus could not be created again!", status_code=409)
    return JSONResponse(content=response.__dict__, status_code=201)

# Update Existing User
class UpdatableUserInfo(BaseModel):
    platform: str | None = None
    username: str | None = None
    number_of_replays: int | None = None
    wins: int | None = None
    losses: int | None = None
    total_goals: int | None = None
    total_assists: int | None = None
    total_saves: int | None = None
    total_shots: int | None = None
@router.put("/users/{user_id}")
def update_user(info_to_update: UpdatableUserInfo = Body(), user_id: int = Path(default=..., ge=1)):
    non_none_info = {key: value for key, value in info_to_update.__dict__.items() if value is not None}
    if len(non_none_info) == 0:
        return PlainTextResponse(content="To update this user, you have to provide parameters to update", status_code=422)
    response = UserService().update_user(non_none_info, user_id)
    if response is None:
        return PlainTextResponse(content="Something went wrong, but I'm sure it's your fault!", status_code=400)
    return JSONResponse(content=response.__dict__, status_code=200)

@router.delete("/users/{user_id}")
def delete_user(user_id: int = Path(default=..., ge=1)):
    response = UserService().delete_user(user_id)
    if response is None:
        return PlainTextResponse(content="Something went wrong, but I'm sure it's your fault!", status_code=400)
    return JSONResponse(content=response.__dict__, status_code=200)