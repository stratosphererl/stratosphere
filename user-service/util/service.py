from config.database import Database
import abc
import os
from loguru import logger

class Service(abc.ABC):
    db = None
    def __init__(self, db=Database):
        if db is Database:
            self.db = db(
                test = os.getenv("DOCKER_RUNNING") is None
            )