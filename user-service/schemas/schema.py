from pydantic import BaseModel
from enum import Enum

""" TODO: Add your schemas here. """
class ExampleSchema(BaseModel):
    name: str
    age: int

class Platform(Enum):
    STEAM = 0
    EPIC = 1

class UserSchema(BaseModel):
    id: int
    platform: str
    username: str
