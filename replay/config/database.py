
import os
from .envs import *

from pymongo import MongoClient
from pymongo.collection import Collection

assert os.getenv(DB_VAR_HOST_NAME) is not None, "DB_HOST is not set"
assert os.getenv(DB_VAR_NAME) is not None, "DB_NAME is not set"
assert os.getenv(DB_VAR_USER_NAME) is not None, "DB_USER is not set"
assert os.getenv(DB_VAR_PASSWORD_NAME) is not None, "DB_PASSWORD is not set"
assert os.getenv(DB_VAR_PORT_NAME) is not None, "DB_PORT is not set"

client = MongoClient('mongodb://%s:%s@%s:%s/%s?authSource=admin' % 
    (
        os.getenv(DB_VAR_USER_NAME), 
        os.getenv(DB_VAR_PASSWORD_NAME), 
        os.getenv(DB_VAR_HOST_NAME),
        os.getenv(DB_VAR_PORT_NAME),
        os.getenv(DB_VAR_NAME),
    )
)

collection: Collection = client[os.getenv(DB_VAR_NAME)][os.getenv(DB_VAR_NAME)]