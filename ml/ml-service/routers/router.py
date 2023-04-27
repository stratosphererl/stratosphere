from fastapi import APIRouter, status, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from parsing.parser import boxcars_parse, carball_parse
from preprocessing.FormatFrames import formatFrames
from preprocessing.CleanFrames import clean

from time import time

from logging import log, ERROR

router = APIRouter()

@router.get("/")
def read_root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Hello World"})

@router.post("/predict")
async def predict(file: UploadFile = File(..., description="Replay file to be analyzed using our ml models.")):

    if not file.filename.endswith(".replay"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is not a .replay file.")

    start = time()   
    try:
        _json = boxcars_parse(file)
    except Exception as e:
        log(ERROR, e)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Failed to parse replay file.") from e
    time_to_parse = time() - start

    start = time()
    try:
        replay = carball_parse(_json)
    except Exception as e:
        log(ERROR, e)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Failed to analyze replay file.") from e
    time_to_analyze = time() - start

    start = time()
    try:
        df = formatFrames(replay)
    except Exception as e:
        log(ERROR, e)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Failed to format replay file.") from e
    time_to_format = time() - start

    start = time()
    try:
        df = clean(df)
    except Exception as e:
        log(ERROR, e)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Failed to clean replay file.") from e
    time_to_clean = time() - start

    return JSONResponse(status_code=status.HTTP_200_OK, content={
        "time_to_parse": time_to_parse, 
        "time_to_analyze": time_to_analyze, 
        "time_to_format": time_to_format, 
        "time_to_clean": time_to_clean})

