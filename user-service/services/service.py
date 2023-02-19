from schemas.schema import *
from util.service import Service

class ServiceExample(Service):
    def get_example(self, example_id: int) -> ExampleSchema:
        # result = self.db.example.find_one({"id": example_id})
        example = ExampleSchema(name="Foo", age=42)
        return example

class UserService(Service):
    def get_users(self, skip: int, limit: int) -> list[UserSchema]:

        result = [
            UserSchema(
                id=x[0], 
                platform = 'Steam' if x[1] == 0 else 'Epic',
                username = x[2],
            ) for x in self.db.get_users(skip, limit)
        ]

        return result