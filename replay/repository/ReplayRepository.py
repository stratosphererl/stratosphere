from util.RepositoryABC import RepositoryABC, MongoRepository
from schemas.parsed_replay import DetailedReplay

class ReplayRepository(RepositoryABC, MongoRepository):
    def __init__(self, collection):
        MongoRepository.__init__(self, collection)
    
    def get(self, id):
        document = self.collection.find_one({"_id": id})
        if not document:
            raise Exception("Replay not found")
        
        return document

    def get_all(self):
        cursor = self.collection.find()
        return cursor

    def add(self, entity : DetailedReplay):
        cursor = self.collection.insert_one(entity.dict(by_alias=True))
        return cursor.inserted_id

    def update(self, id, entity):
        existing_document = self.collection.find_one({"_id": id})
        if not existing_document:
            raise Exception("Replay not found")
        
        update_result = self.collection.update_one({"_id": id}, {"$set": entity.dict(by_alias=True)})
        if update_result.modified_count != 1:
            raise Exception("Replay update failed")
        
        return True

    def delete(self, id):
        cursor = self.collection.delete_one({"_id": id})
        if cursor.deleted_count == 0:
            raise Exception("Replay not found")
        
        return True

    def search(self, filters):
        cursor = self.collection.find(filters)
        return cursor

    def count(self):
        return self.collection.estimated_document_count({})

    def exists(self, id):
        cursor = self.collection.find_one({"_id": id})
        return cursor is not None

    def paginate_filter(self, page, per_page, filters):
        skip = page * per_page
        cursor = self.collection.find(filters).skip(skip).limit(per_page)
        
        return cursor