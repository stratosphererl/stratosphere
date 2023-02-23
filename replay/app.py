from routers import router
from config import database

from fastapi import FastAPI

app = FastAPI()

app.include_router(router=router.router, prefix="/api/v1")