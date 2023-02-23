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
    def __init__(self, test = False):
        self.test = test
        self.conn = self.connect()
    
    def connect(self):
        try:
            conn = psycopg2.connect(
                host = os.getenv(
                    DB_VAR_HOST_NAME_TEST if self.test else DB_VAR_HOST_NAME
                ),
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

    ### QUERIES FOR REPLAYS DATA ###

    # Returns the total number of replays on our platform
    def get_replay_count_all(self):
        return self.execute_query(["SELECT SUM(count) FROM replays_by_rank"])
    
    # Returns the total number of replays on our platform played on a specific arena
    def get_replay_count_arena(self, arena_num):
        return self.execute_query(["SELECT count FROM replays_by_arena WHERE (num = %s)", [arena_num]])

    # Returns the total number of replays on our platform which have a duration in the specific range
    def get_replay_count_duration(self, min_duration, max_duration):
        return self.execute_query(["SELECT SUM(count) FROM replays_by_duration WHERE (duration >= %s) AND (duration <= %s)", [min_duration, max_duration]]) - self.execute_query(["SELECT count FROM replays_by_duration WHERE (duration = %s)", [max_duration]])
    
    # Returns the number of replays on our platform with a specific rank
    def get_replay_count_rank(self, low_rank_num, high_rank_num):
        return self.execute_query(["SELECT count FROM replays_by_rank WHERE (num >= %s) AND (num <= %s)", [low_rank_num, high_rank_num]])

    # Returns the number of replays on our platform from a specific season
    def get_replay_count_season(self, low_season_num, high_season_num):
        return self.execute_query(["SELECT count FROM replays_by_season WHERE (num >= %s) AND (num <= %s)", [low_season_num, high_season_num]])

    ### QUERIES FOR USERS DATA ###

    # Returns the total number of users on our platform
    def get_user_count_all(self):
        return self.execute_query(["SELECT SUM(count) FROM users_by_platform"])
    
    # Returns the number of users on our platform from a specific platform (Steam or Epic)
    def get_user_count_platform(self, platform_num):
        return self.execute_query(["SELECT count FROM users_by_platform WHERE num = %s", [platform_num]])
    
    # Returns the number of users on our platform with their latest known rank being the specific rank(s)
    def get_user_count_rank(self, low_rank_num, high_rank_num):
        return self.execute_query(["SELECT SUM(count) FROM users_by_rank WHERE (num >= %s) AND (num <= %s)", [low_rank_num, high_rank_num]])
    
    ### UTILITY METHODS ###

    # Utility method to make get_x_count_x methods one-liners
    def execute_query(self, query: list):
        cur = self.conn.cursor()

        if len(query) == 1:
            print(query)
            cur.execute(query[0])
        elif len(query) == 2:
            print(query)
            cur.execute(query[0], query[1])

        return cur.fetchone()[0]

    # Utility method for allowing only valid values
    def get_valid_range(self, table_name):
        valid_range = set()
        cur = self.conn.cursor()

        cur.execute("SELECT MIN(num) FROM " + table_name)
        valid_range.add(cur.fetchone()[0])

        cur.execute("SELECT MAX(num) FROM " + table_name)
        valid_range.add(cur.fetchone()[0])

        return valid_range

def init():
    """
    Initializes singleton database, avoids circular imports
    """
    logger.debug("Initializing database...")
    global db
    db = Database()