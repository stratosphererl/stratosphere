from fastapi import APIRouter
from config import database
from services.service import ServiceExample
from util.result import ServiceResponse

router = APIRouter()

@router.get("/")
def home():
    result = ServiceExample().get_example(2121)
    return ServiceResponse(result)
    
### TODO: Add more routes here ###