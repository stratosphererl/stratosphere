from fastapi import APIRouter, status, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from parsing.parser import carball_parse

from time import time

router = APIRouter()

@router.get("/")
def read_root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Hello World"})

@router.post("/predict")
async def predict(file: UploadFile = File(..., description="Replay file to be analyzed using our ml models.")):

    if not file.filename.endswith(".replay"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is not a .replay file.")

    start = time()   
    replay = carball_parse(file)

    return JSONResponse(status_code=status.HTTP_200_OK, content={"time_to_parse": time() - start})

