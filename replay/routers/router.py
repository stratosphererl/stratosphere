from fastapi import APIRouter, Depends, Response, HTTPException, status, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from jose import JWTError, jwt
from typing import Optional
import os, json
from parser.worker import celery

from services.service import ReplayService
from util.result import ServiceResponseSuccess, ServiceResponseError, ServiceResponsePage
from config.database import collection
from repository.ReplayRepository import ReplayRepository
from config.envs import *
from schemas.forms import ReplayUpdateForm

import shutil
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/token")

ADMIN_USERNAME = os.getenv(ADMIN_USER_NAME)
ADMIN_PASSWORD = os.getenv(ADMIN_PASSWORD_NAME)
SECRET_KEY = os.getenv(SECRET_KEY_NAME)
ENCODER_ALGORITHM = os.getenv(ENCODER_ALGORIGHTM_NAME)

def is_admin(username, password):
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
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

router = APIRouter()

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

def service():
    return ReplayService(ReplayRepository(collection))

@router.get("/")
def home():
    return {"message": "Welcome to the Replay API"}

@router.get("/replays")
def get_replays(page: int = 0, limit: int = 30, service: ReplayService = Depends(service)):
    result = service.get_replays(page, limit)

    if limit > 100:
        return HTTPException(status_code=400, detail="Limit cannot be greater than 100")
    
    if isinstance(result, ServiceResponsePage):
        return Response(content=result.json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.get("/replays/search")
def search_replays(page: int = 0, 
                   limit: int = 30, 
                   name: Optional[str] = None,
                   map: Optional[str] = None,
                   gameMode: Optional[str] = None,
                   teamSize: Optional[int] = None,
                   players: Optional[str] = None,
                   length: Optional[int] = None,
                   region: Optional[str] = None,
                   date: Optional[str] = None,
                   service: ReplayService = Depends(service)):
    
    if limit > 100:
        return HTTPException(status_code=400, detail="Limit cannot be greater than 100")

    filters = {}
    
    if name:
        filters["name"] = name
    if map:
        filters["map"] = map
    if gameMode:
        filters["gameMode"] = gameMode
    if teamSize:
        filters["teamSize"] = teamSize
    if players:
        filters["players"] = players
    if length:
        filters["length"] = length
    if region:
        filters["region"] = region
    if date:
        filters["date"] = date
    
    result = service.search(page, limit, filters)

    if isinstance(result, ServiceResponsePage):
        return Response(content=result.json(), media_type="application/json", status_code=200)
    elif isinstance(result, ServiceResponseError):
        return HTTPException(status_code=404, detail=result.message)
    

@router.get("/replays/count")
def get_replays_count(service = Depends(service)):
    return Response(content=service.get_replays_count().json(), media_type="application/json", status_code=200)

@router.get("/replays/{id}")
def get_replay_by_id(id: str, service = Depends(service)):
    result = service.get_replay(id)
    
    if isinstance(result, ServiceResponseSuccess):
        return Response(content=result.data[0].json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.get("/replay/status/{id}")
def get_replay_status(id: str, service = Depends(service)):
    if id is None:
        return HTTPException(status_code=400, detail="Replay id is required")
    
    result = celery.AsyncResult(id)
    print(result.state, result.info)

    response = {}
    if result.state == "PENDING":
        response = {"state": str(result.state), "status": "Pending..."}
    elif result.state != "FAILURE":
        response = {"state": str(result.state), "status": str(result.traceback)}
    else:
        response = {"state": str(result.state), "status": str(result.info)}
    
    return Response(content=json.dumps(response), media_type="application/json", status_code=200)


@router.get("/replays/user/{user_id}")
def get_user_replay(user_id: str, service = Depends(service)):
    result = service.search(0, 999, {"players": user_id})
    
    if isinstance(result, ServiceResponsePage):
        return Response(content=result.json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.post("/replays")
def post_replay(file : UploadFile, token: str = Depends(get_current_user), service = Depends(service)):
    if not str(file.filename).endswith(".replay"):
        return HTTPException(status_code=400, detail="Not a valid replay file")
    
    filename = str(uuid.uuid4()) + ".replay"
    with open(f"./parser/files/{filename}", "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    path = f"./files/{filename}"

    task = celery.send_task("parse", args=[path])

    return Response(content=json.dumps({"task-id": task.id}), media_type="application/json", status_code=202)

@router.delete("/replays/{id}")
def delete_replay_by_id(id: str, token: str = Depends(get_current_user), service = Depends(service)):
    result = service.delete_replay(id)

    if isinstance(result, ServiceResponseSuccess):
        return Response(content=result.json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.put("/replays/{id}")
def update_replay_by_id(form: ReplayUpdateForm, id: str, token: str = Depends(get_current_user), service = Depends(service)):
    if not isinstance(form, ReplayUpdateForm):
        return HTTPException(status_code=400, detail="Invalid request body")
    
    if not form.name:
        return HTTPException(status_code=400, detail="Name is required")
    
    result = service.update_replay(id, form)

    if isinstance(result, ServiceResponseSuccess):
        return Response(content=result.json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.get("/replays/download/{id}")
def download_replay_by_id(id: str, service = Depends(service)):
    result = service.get_replay(id)
    if isinstance(result, ServiceResponseSuccess):
        return FileResponse(f"./parser/files/{id}/{id}.replay", media_type="application/octet-stream")
    else:
        return HTTPException(status_code=404, detail=f"Unable to download replay. {result.message}")