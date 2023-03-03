from config import database
import abc
from unittest.mock import MagicMock

class Service(abc.ABC):
    def __init__(self, db=database.Database):
        if not isinstance(db, MagicMock):
            self.db = db(test = False) # Keep as False for browser access of endpoints to work
        else:
            self.db = db