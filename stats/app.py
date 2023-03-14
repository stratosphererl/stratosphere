from config import database
from routers import router
from subprocess import Popen

from fastapi import FastAPI

# database.init()
app = FastAPI()

app.include_router(router=router.router, prefix="/api/v1")

# @app.on_event("shutdown")
# def shutdown_event():
#     database.db.close_connection()

# Run file to set up update statsdb data and setup CRON job to do the same everyday
Popen(["python", "cron/cron.py"]) # Runs in another process so Docker initialization finishes