from config import database 
from util.result import Result
from schemas.schema import ExampleSchema

class ServiceExample:
    def get_example(self, example_id: int) -> Result:
        # Do something with db.yourMethodHere(example_id)
        example = ExampleSchema(name="Foo", age=42)
        return Result(example)