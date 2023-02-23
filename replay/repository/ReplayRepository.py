from util.RepositoryABC import RepositoryABC, MongoRepository
from schemas.parsed_replay import DetailedReplay, ReplayHeader

class ReplayRepository(RepositoryABC, MongoRepository):
    def __init__(self, collection):
        MongoRepository.__init__(self, collection)
    
    def get(self, id):
        document = self.collection.find_one({"_id": id})
        if not document:
            raise Exception("Replay not found")
        
        return DetailedReplay(**document)

    def get_all(self):
        cursor = self.collection.find()
        return [ReplayHeader(**document['gameMetadata']) for document in cursor]

    def add(self, entity : DetailedReplay):
        cursor = self.collection.insert_one(entity.dict())
        return cursor.inserted_id

    def update(self, id, entity):
        pass

    def delete(self, id):
        cursor = self.collection.delete_one({"_id": id})
        # TODO: Handle error
        return cursor.deleted_count == 1

    def search(self, **kwargs):
        pass

    def count(self):
        return self.collection.estimated_document_count({})

    def exists(self, id):
        cursor = self.collection.find_one({"_id": id})
        return cursor is not None

    def paginateAndFilter(self, page, per_page, filters):
        skip = (page - 1) * per_page
        cursor = self.collection.find(filters).skip(skip).limit(per_page)
        
        return [ReplayHeader(**document['gameMetadata']) for document in cursor]
        