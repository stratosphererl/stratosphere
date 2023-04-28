import psycopg2
import sys
import os
import abc
from loguru import logger

from .envs import *

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
    def __init__(self, test=False):
        self.test = test
        self.conn = self.connect()
    
    def connect(self):
        try:
            conn = psycopg2.connect(
                host = "localhost" if self.test else os.getenv(USER_DB_VAR_HOST_NAME),
                dbname = os.getenv(USER_DB_VAR_NAME),
                user = os.getenv(USER_DB_VAR_USER_NAME),
                password = os.getenv(USER_DB_VAR_PASSWORD_NAME),
                port = os.getenv(USER_DB_VAR_PORT_NAME) if self.test else os.getenv(USER_DB_VAR_PORT_NAME)
            )
        except psycopg2.OperationalError as e:
            print(f"Could not connect to Database: {e}")
            sys.exit(1)

        return conn
    
    def close_connection(self):
        self.conn.close()

    def get_users(self, search_parameters: dict):
        skip = (search_parameters["page"] - 1) * search_parameters["limit"]
        username = ''.join(('%(', search_parameters["username"], ')%'))
        with self.conn.cursor() as cur:
            try:
                if search_parameters["platform"] != 'both':
                    cur.execute("SELECT * FROM users WHERE platform = %s AND LOWER(username) SIMILAR TO LOWER(%s) ORDER BY id LIMIT %s OFFSET %s;", 
                                (search_parameters["platform"], username, search_parameters["limit"], skip,))
                else:
                    cur.execute("SELECT * FROM users WHERE LOWER(username) SIMILAR TO LOWER(%s) ORDER BY id LIMIT %s OFFSET %s;", 
                                (username, search_parameters["limit"], skip,))
                return cur.fetchall()
            except:
                cur.execute("ROLLBACK")
                self.conn.commit()
                return []

    def get_user(self, user_id: int):
        with self.conn.cursor() as cur:
            try:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
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
                return True 
            except:
                cur.execute("ROLLBACK")
                logger.error(cur.statusmessage)
                self.conn.commit()
                return False

    def update_user(self, update_values: tuple, id: int) -> bool:
        update_values = update_values + (id,)
        with self.conn.cursor() as cur:
            try:
                cur.execute("""UPDATE users SET platform = %s, username = %s, date_created = %s, number_of_replays = %s, wins = %s, losses = %s, total_goals = %s, total_assists = %s,
                total_saves = %s, total_shots = %s WHERE id = %s""", update_values)
                self.conn.commit()
                return True
            except:
                logger.error(cur.statusmessage)
                cur.execute("ROLLBACK")
                self.conn.commit()
                return False
            
    def delete_user(self, user_id: int) -> tuple | None:
        with self.conn.cursor() as cur:
            try:
                cur.execute("DELETE FROM users WHERE id = %s RETURNING *", (user_id,))
                self.conn.commit()
                return cur.fetchone()
            except:
                logger.error(cur.statusmessage)
                cur.execute("ROLLBACK")
                self.conn.commit()
                return None