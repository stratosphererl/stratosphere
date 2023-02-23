from abc import ABC, abstractmethod
from pymongo.collection import Collection

class RepositoryABC(ABC):
    @abstractmethod
    def get(self, id):
        pass

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def add(self, entity):
        pass

    @abstractmethod
    def update(self, entity):
        pass

    @abstractmethod
    def delete(self, id):
        pass

    @abstractmethod
    def search(self, **kwargs):
        pass

    @abstractmethod
    def count(self):
        pass

    @abstractmethod
    def exists(self, id):
        pass

    @abstractmethod
    def paginateAndFilter(self, page, per_page, filters: dict):
        pass

class MongoRepository():
    def __init__(self, collection : Collection):
        self.collection = collection