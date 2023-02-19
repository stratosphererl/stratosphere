from schemas.schema import CountSchema
from util.service import Service
from config.database import Database

class StatsClass(Service):
    # def get_example(self, example_id: int) -> ExampleSchema:
    #     # result = self.db.example.find_one({"id": example_id})
    #     example = ExampleSchema(name="Foo", age=42)
    #     return example
    
    def get_replay_count_all(self) -> CountSchema:
        return CountSchema(count = self.db.get_replay_count_all())
    
    def get_user_count_all(self) -> CountSchema:
        return CountSchema(count = self.db.get_user_count_all())
    
    def get_replay_count_test(self, low_rank, high_rank) -> CountSchema:
        return CountSchema(count = self.db.get_user_count_test(low_rank, high_rank))
