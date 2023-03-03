import psycopg2
from dotenv import load_dotenv
import sys
import os
import abc
from loguru import logger

from .envs import *

db = None

class AbstractDatabase(abc.ABC):
    """
    Abstract database class
    """
    @abc.abstractmethod
    def connect(self):
        """
        Make and return connection, assuming you have right configuration environment credentials
        """
        pass

    @abc.abstractmethod
    def close_connection(self):
        """
        Closes connection to database
        """
        pass

class Database(AbstractDatabase):
    def __init__(self):
        self.conn = self.connect()
    
    def connect(self):
        try:
            conn = psycopg2.connect(
                host = os.getenv(DB_VAR_HOST_NAME),
                dbname = os.getenv(DB_VAR_NAME),
                user = os.getenv(DB_VAR_USER_NAME),
                password = os.getenv(DB_VAR_PASSWORD_NAME),
                port = os.getenv(DB_VAR_PORT_NAME)
            )
        except psycopg2.OperationalError as e:
            print(f"Could not connect to Database: {e}")
            sys.exit(1)

        return conn
    
    def close_connection(self):
        self.conn.close()

    ## TODO: ADD MORE METHODS HERE ## 

    ## Example method
    # def example(self, example_id: int):
    #     """
    #     Example method
    #     """
    #     cur = self.conn.cursor()
    #     cur.execute("SELECT * FROM example WHERE id = %s", (example_id,))
    #     return cur.fetchone()

def init():
    """
    Initializes singleton database, avoids circular imports
    """
    logger.debug("Initializing database...")
    global db
    db = Database()