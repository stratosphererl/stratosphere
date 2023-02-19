from schemas.schema import ExampleSchema, CountSchema
from util.service import Service
from config.database import Database

class ServiceExample(Service):
    # def get_example(self, example_id: int) -> ExampleSchema:
    #     # result = self.db.example.find_one({"id": example_id})
    #     example = ExampleSchema(name="Foo", age=42)
    #     return example
    
    def get_replay_count_all(self) -> CountSchema:
        result = self.db.get_replay_count_all()
        return CountSchema(count=result)
