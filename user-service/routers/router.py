from fastapi import APIRouter
from services.service import ServiceExample, UserService
from util.result import ServiceResponse

router = APIRouter()

@router.get("/")
def home():
    result = ServiceExample().get_example(2121)
    return result
    
### TODO: Add more routes here ###

@router.get("/users")
def users(skip: int = 0, limit: int = 10):
    response = UserService().get_users(skip, limit)
    return response