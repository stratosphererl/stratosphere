from fastapi import FastAPI
from routers import router

import logging

logging.getLogger('carball').setLevel(logging.FATAL)

app = FastAPI()

app.include_router(router=router.router, prefix="/api/v1")
