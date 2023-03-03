from typing import Type
from config.database import Database
import abc
from loguru import logger

class Service(abc.ABC):
    db = None
    def __init__(self, db=Database):
        if db is Database:
            self.db = db()