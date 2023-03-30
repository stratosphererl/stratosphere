import os

from fastapi import APIRouter, HTTPException, status, Path, Query, Body, Depends
from fastapi.responses import JSONResponse, PlainTextResponse

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt

from pydantic import BaseModel, Field

from services.service import UserService

from config.envs import *

SECRET_KEY = os.getenv(SECRET_KEY_NAME)
ENCODER_ALGORITHM = os.getenv(ENCODER_ALGORIGHTM_NAME)

ADMIN_USERNAME = os.getenv(USER_DB_VAR_USER_NAME)
ADMIN_PASSOWRD = os.getenv(USER_DB_VAR_PASSWORD_NAME)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/token")

def is_admin(username, password):
    if username == ADMIN_USERNAME and password == ADMIN_PASSOWRD:
        return True
    return False

def authenticate_user(username, password):
    if is_admin:
        return {"username": username, "password": password}
    
def create_access_token(data: dict):
    encoded_jwt = jwt.encode(data.copy(), SECRET_KEY, algorithm=ENCODER_ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    ) 
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ENCODER_ALGORITHM])
        if payload.get("username") is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return payload.copy()

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        ) 
    access_token = create_access_token(data=user)
    return {"access_token": access_token, "token_type": "bearer"}

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
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND, 
            detail = "No users with those parameters could be found!"
        )
    return JSONResponse(content=[x.__dict__ for x in response], status_code=200)

# Get User by ID
@router.get("/users/{user_id}")
def get_user_by_id(user_id: int = Path(ge=1)):
    response = UserService().get_user(user_id)

    if response is None:
        raise HTTPException(detail=f"The user with id: {user_id} does not exist!", status_code=404)
    return JSONResponse(content=response.__dict__, status_code=200)

# Create New User
class NewUserInfo(BaseModel):
    id: int = Field(default=..., ge=1)
    platform: str = Field(default=..., regex='steam|epic')
    username: str = Field(default=...)
@router.post("/users")
def create_user(user: NewUserInfo = Body(), _ = Depends(get_current_user)):
    response = UserService().create_user(user.dict())
    
    if response is None:
        raise HTTPException(detail="This user already exists and thus could not be created again!", status_code=409)
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
def update_user(info_to_update: UpdatableUserInfo = Body(), user_id: int = Path(default=..., ge=1), _ = Depends(get_current_user)):
    non_none_info = {key: value for key, value in info_to_update.__dict__.items() if value is not None}
    if len(non_none_info) == 0:
        raise HTTPException(detail="To update this user, you have to provide parameters to update", status_code=422)
    response = UserService().update_user(non_none_info, user_id)
    if response is None:
        raise HTTPException(detail="Something went wrong, but I'm sure it's your fault!", status_code=400)
    return JSONResponse(content=response.__dict__, status_code=200)

@router.delete("/users/{user_id}")
def delete_user(user_id: int = Path(default=..., ge=1), _ = Depends(get_current_user)):
    response = UserService().delete_user(user_id)
    if response is None:
        raise HTTPException(detail="Something went wrong, but I'm sure it's your fault!", status_code=400)
    return JSONResponse(content=response.__dict__, status_code=200)