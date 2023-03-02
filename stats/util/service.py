from config import database
import abc
from unittest.mock import MagicMock

class Service(abc.ABC):
    def __init__(self, db=database.Database):
        if not isinstance(db, MagicMock):
            self.db = db(test = True) # Added test = True to get Router_integration_test.py working
        else:
            self.db = db