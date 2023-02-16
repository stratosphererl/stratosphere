from config import database
from routers import router

import uvicorn
from fastapi import FastAPI

import dotenv
import os

dotenv.load_dotenv()

database.init()
app = FastAPI()

app.include_router(router=router.router, prefix="/api/v1")

@app.on_event("shutdown")
def shutdown_event():
    database.db.close_connection()

if __name__ == "__main__":
    port_number = os.getenv("PORT")

    if port_number is None:
        raise Exception("SERVICE_PORT environment variable not set")

    uvicorn.run(app, host="0.0.0.0", port=int(port_number))