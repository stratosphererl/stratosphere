from util.result import Result
from schemas.schema import ExampleSchema
from util.service import Service

class ServiceExample(Service):
    def get_example(self, example_id: int) -> Result:
        # result = self.db.example.find_one({"id": example_id})
        example = ExampleSchema(name="Foo", age=42)
        return Result(example)