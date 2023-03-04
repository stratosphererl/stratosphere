from config import database
from routers import router

from fastapi import FastAPI

# database.init()
app = FastAPI()

app.include_router(router=router.router, prefix="/api/v1")

# @app.on_event("shutdown")
# def shutdown_event():
#     database.db.close_connection()