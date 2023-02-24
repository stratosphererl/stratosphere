from fastapi import APIRouter, Path, Query
from fastapi.responses import JSONResponse, PlainTextResponse

from services.service import UserService

router = APIRouter()

# Get users based on parameters
@router.get("/users")
def get_users_by_params(
    skip: int = Query(default=0), 
    limit: int = Query(default=10), 
    platform: str = Query(default='both', regex='steam|epic|both'), 
    username: str = Query(default=""),
):
    response = UserService().get_users(dict({
        "skip": skip,
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
@router.post("/users")
def create_user(
    id: int = Query(default=..., ge=1),
    platform: str = Query(default=..., regex='steam|epic'),
    username: str = Query(default=...),
):
    response = UserService().create_user(dict({
        "id": id,
        "platform": platform,
        "username": username,
    }))
    
    if response is None:
        return PlainTextResponse(content="This user already exists and thus could not be created again!", status_code=409)
    return JSONResponse(content=response.__dict__, status_code=201)
