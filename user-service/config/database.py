import psycopg2
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
                host = os.getenv(USER_DB_VAR_HOST_NAME),
                dbname = os.getenv(USER_DB_VAR_NAME),
                user = os.getenv(USER_DB_VAR_USER_NAME),
                password = os.getenv(USER_DB_VAR_PASSWORD_NAME),
                port = os.getenv(USER_DB_VAR_PORT_NAME)
            )
        except psycopg2.OperationalError as e:
            print(f"Could not connect to Database: {e}")
            sys.exit(1)

        return conn
    
    def close_connection(self):
        self.conn.close()

    def get_users(self, search_parameters: dict):
        username = ''.join(('%(', search_parameters["username"], ')%'))
        with self.conn.cursor() as cur:
            try:
                if search_parameters["platform"] != 'both':
                    cur.execute("SELECT * FROM users WHERE platform = %s AND LOWER(username) SIMILAR TO LOWER(%s) LIMIT %s OFFSET %s;", 
                                (search_parameters["platform"], username, search_parameters["limit"], search_parameters["skip"],))
                else:
                    cur.execute("SELECT * FROM users WHERE LOWER(username) SIMILAR TO LOWER(%s) LIMIT %s OFFSET %s;", 
                                (username, search_parameters["limit"], search_parameters["skip"],))
                self.conn.commit()
                return cur.fetchall()
            except:
                cur.execute("ROLLBACK")
                self.conn.commit()
                return []

    def get_user(self, user_id: int):
        with self.conn.cursor() as cur:
            try:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                self.conn.commit()
                return cur.fetchone()
            except:
                cur.execute("ROLLBACK")
                self.conn.commit() 
                return None

    def create_user(self, user_values: dict) -> bool:
        with self.conn.cursor() as cur:
            keys, values = zip(*user_values.items())
            execution_values = values
            try:
                cur.execute("""INSERT INTO users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots)
                             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);""", execution_values)
                self.conn.commit()
                logger.debug(cur.statusmessage)
                return True 
            except:
                cur.execute("ROLLBACK")
                logger.error(cur.statusmessage)
                self.conn.commit()
                return False 
            
def init():
    """
    Initializes singleton database, avoids circular imports
    """
    logger.debug("Initializing database...")
    global db
    db = Database()