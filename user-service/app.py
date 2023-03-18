from routers import router

from fastapi import FastAPI

app = FastAPI()

app.include_router(router=router.router, prefix="/api/v1")