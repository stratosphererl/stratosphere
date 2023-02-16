from config import database 
import abc

class Service(abc.ABC):
    def __init__(self, db=database.db):
        self.db = db