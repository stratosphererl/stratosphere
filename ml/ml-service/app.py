from fastapi import FastAPI
from routers import router

app = FastAPI()

app.include_router(router=router.router, prefix="/api/v1")
