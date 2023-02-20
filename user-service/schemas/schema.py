from pydantic import BaseModel
from enum import Enum

""" TODO: Add your schemas here. """
class ExampleSchema(BaseModel):
    name: str
    age: int

class UserSchema(BaseModel):
    id: int
    platform: str
    username: str
    date_created: str
    n_replays: int
    n_wins: int
    n_losses: int
    n_goals: int
    n_assists: int
    n_saves: int
    n_shots: int
