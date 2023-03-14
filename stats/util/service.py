from config import database
import os
import abc
from unittest.mock import MagicMock

class Service(abc.ABC):
    def __init__(self, db=database.Database):
        if isinstance(db, MagicMock):
            self.db = db # No new database object (has test = False)
        elif os.getenv("DOCKER_RUNNING") == None:
            self.db = db(test = True) # New Database object (with test = True)
        else:
            self.db = db(test = False) # New Database object (with test = False)