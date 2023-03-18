import os
from fastapi import Response
from config import envs
from pydantic import BaseModel

class ServiceResponse(Response):
    def __init__(self, *args, **kwargs):
        super().__init__(self, *args, **kwargs)

        self.service_name = os.getenv(envs.SERVICE_VAR_NAME)
        if self.service_name is None:
            raise Exception(f"{envs.SERVICE_VAR_NAME} not found in environment variables, please check your .env file")
    
    def __str__(self) -> str:
        return f"{self.service_name}<{super().__str__()}>"

class ServiceResponseError(BaseModel):
    error: str
    message: str

class ServiceResponseSuccess(BaseModel):
    data: list