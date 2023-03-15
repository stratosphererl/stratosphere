from routers import router
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI()

def custom():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Replay Service API",
        version="1.0.0",
        description="Replay service API for Stratosphere",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://avatars.githubusercontent.com/u/112001772?s=200&v=4"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom

app.include_router(router=router.router, prefix="/api/v1")