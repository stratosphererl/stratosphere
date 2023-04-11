from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/")
def read_root():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Hello World"})