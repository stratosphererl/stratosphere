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

    # Returns the total number of replays on our platform
    def get_replay_count_all(self):
        cur = self.conn.cursor()
        cur.execute("SELECT COUNT(count) FROM replays_by_rank")
        return cur.fetchone()
    
    # Returns the number of replays on our platform with a specific rank
    def get_replay_count_rank(self, rank_num):
        cur = self.conn.cursor()
        cur.execute("SELECT count FROM replays_by_rank WHERE num = %s", (rank_num,))
        return cur.fetchone()

    # Returns the number of replays on our platform from a specific season
    def get_replay_count_rank(self, season_num):
        cur = self.conn.cursor()
        cur.execute("SELECT count FROM replays_by_season WHERE num = %s", (season_num,))
        return cur.fetchone()

    # Returns the total number of users on our platform
    def get_user_count_all(self):
        cur = self.conn.cursor()
        cur.execute("SELECT COUNT(count) FROM users_by_platform")
        return cur.fetchone()
    
    # Returns the number of users on our platform from a specific platform (Steam or Epic)
    def get_user_count_platform(self, platform_num):
        cur = self.conn.cursor()
        cur.execute("SELECT count FROM users_by_platform WHERE num = %s", (platform_num,))
        return cur.fetchone()

def init():
    """
    Initializes singleton database, avoids circular imports
    """
    logger.debug("Initializing database...")
    global db
    db = Database()