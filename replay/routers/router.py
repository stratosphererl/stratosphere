from fastapi import APIRouter, Depends, Response, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import FileResponse, JSONResponse
from jose import JWTError, jwt
from typing import Optional, List
import os, json
from parser.worker import celery
from parser.helper import mmr2rank

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

@router.post("/token", tags=['Post Methods'])
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

@router.get("/", tags=['Get Methods (Dynamic)'])
def home():
    return {"message": "Welcome to the Replay API"}

@router.get("/replays/maps", tags=['Get Methods (Static)'])
def get_maps():
    fp = "./resource/map.json"
    if not os.path.exists(fp):
        return HTTPException(status_code=404, detail="Unable to find map data")
    else:
        with open(fp, "r") as f:
            return FileResponse(fp, media_type="application/json", status_code=200)

@router.get("/replays/ranks", tags=['Get Methods (Static)'])
def get_ranks():
    fp = "./resource/rank.json"
    if not os.path.exists(fp):
        return HTTPException(status_code=404, detail="Unable to find rank data")
    else:
        with open(fp, "r") as f:
            return FileResponse(fp, media_type="application/json", status_code=200)

@router.get("/replays/seasons", tags=['Get Methods (Static)'])
def get_seasons():
    fp = "./resource/season.json"
    if not os.path.exists(fp):
        return HTTPException(status_code=404, detail="Unable to find season data")
    else:
        with open(fp, "r") as f:
            return FileResponse(fp, media_type="application/json", status_code=200)

@router.get("/replays/playlist", tags=['Get Methods (Static)'])
def get_playlist():
    fp = "./resource/playlist.json"
    if not os.path.exists(fp):
        return HTTPException(status_code=404, detail="Unable to find playlist data")
    else:
        with open(fp, "r") as f:
            return JSONResponse(fp, media_type="application/json", status_code=200)

@router.get("/replays", tags=['Get Methods (Dynamic)'])
def get_replays(page: int = 0, limit: int = 30, service: ReplayService = Depends(service)):
    result = service.get_replays(page, limit)

    if limit > 100:
        return HTTPException(status_code=400, detail="Limit cannot be greater than 100")
    
    if isinstance(result, ServiceResponsePage):
        return Response(content=result.json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.get("/replays/search", tags=['Get Methods (Dynamic)'])
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
    

@router.get("/replays/count", tags=['Get Methods (Dynamic)'])
def get_replays_count(service = Depends(service)):
    return Response(content=service.get_replays_count().json(), media_type="application/json", status_code=200)

@router.get("/replays/{id}", tags=['Get Methods (Dynamic)'])
def get_replay_by_id(id: str, service = Depends(service)):
    result = service.get_replay(id)

    
    if isinstance(result, ServiceResponseSuccess):
        data = result.data[0]
        return JSONResponse(data, media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.get("/replays/status/{id}", tags=['Get Methods (Dynamic)'])
def get_replay_status(id: str, service = Depends(service)):
    if id is None:
        return HTTPException(status_code=400, detail="Replay id is required")
    
    result = celery.AsyncResult(id)

    response = {
        "state": str(result.state),
        "status": result.info if result.state != "FAILURE" else result.traceback
    }
    
    return Response(content=json.dumps(response), media_type="application/json", status_code=200)


@router.get("/replays/user/{user_id}", tags=['Get Methods (Dynamic)'])
def get_user_replay(user_id: str, service = Depends(service)):
    result = service.search(0, 999, {"players": user_id})
    
    if isinstance(result, ServiceResponsePage):
        return Response(content=result.json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.post("/replays", tags=['Post Methods'])
def post_replays(files: List[UploadFile] = File(...), token: str = Depends(get_current_user), service = Depends(service)):
    response = []
    for file in files:
        if not str(file.filename).endswith(".replay"):
            response.append({"filename": file.filename, "status": "Not a valid replay file"})
            continue
        
        filename = str(uuid.uuid4()) + ".replay"
        with open(f"./parser/files/{filename}", "wb+") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        path = f"./files/{filename}"

        task = celery.send_task("parse", args=[path, token['username']])

        response.append({"filename": file.filename, "task-id": task.id, "status": "Processing"})
    
    return Response(content=json.dumps(response), media_type="application/json", status_code=202)


@router.delete("/replays/{id}", tags=['Delete Methods'])
def delete_replay_by_id(id: str, token: str = Depends(get_current_user), service = Depends(service)):
    result = service.delete_replay(id)

    if isinstance(result, ServiceResponseSuccess):
        try:
            shutil.rmtree(f"./parser/files/{id}")
        except Exception as e:
            print(f"Couldn't delete replay in data store: {e}")
        return Response(content=result.json(), media_type="application/json", status_code=200)
    else:
        return HTTPException(status_code=404, detail=result.message)

@router.put("/replays/{id}", tags=["Put Methods"])
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

@router.get("/replays/download/{id}", tags=['Get Methods (Dynamic)'])
def download_replay_by_id(id: str, service = Depends(service)):
    result = service.get_replay(id)
    if isinstance(result, ServiceResponseSuccess):
        return FileResponse(f"./parser/files/{id}/{id}.replay", 
                            media_type="application/octet-stream",
                            filename=f"{id}")
    else:
        return HTTPException(status_code=404, detail=f"Unable to download replay. {result.message}")

@router.get("/replays/frames/download/{id}", tags=['Get Methods (Dynamic)'])
def download_replay_frames_by_id(id: str, service = Depends(service)):
    result = service.get_replay(id)
    if isinstance(result, ServiceResponseSuccess):
        path =f"./parser/files/{id}/{id}_frames.csv.gzip"
        return FileResponse(path, 
                            media_type="application/octet-stream",
                            filename=f"{id}-frames.csv.gzip")
    else:
        return HTTPException(status_code=404, detail=f"Unable to download frames. {result.message}")

@router.get("/mmr/{playlist}/{mmr}", tags=['Get Methods (Static)'])
def get_rank_by_mmr(playlist: str, mmr: int):
    try:
        
        result = mmr2rank(mmr, playlist.capitalize())
    except Exception as e:
        return HTTPException(status_code=400, detail=f"Invalid playlist or mmr. {e}")
    
    return Response(content=json.dumps(result), media_type="application/json", status_code=200)