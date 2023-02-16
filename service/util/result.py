from dotenv import load_dotenv
import os
from fastapi import Response

load_dotenv()

class Result:
    def __init__(self, data):
        self.data = data

class ServiceResponse(Response):
    def __init__(self, result, *args, **kwargs):
        content = {'data': result}

        super().__init__(*args, **kwargs)

        self.service_name = os.getenv("SERVICE_NAME")
        if self.service_name is None:
            raise Exception("SERVICE_NAME not found in environment variables, please check your .env file")
    
    def __str__(self) -> str:
        return f"{self.service_name}<{super().__str__()}>"