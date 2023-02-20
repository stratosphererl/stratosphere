from schemas.schema import *
from util.service import Service

class ServiceExample(Service):
    def get_example(self, example_id: int) -> ExampleSchema:
        # result = self.db.example.find_one({"id": example_id})
        example = ExampleSchema(name="Foo", age=42)
        return example

class UserService(Service):
    def get_users(self, skip: int, limit: int, platform: str, username: str) -> list[UserSchema]:
        result = [
            UserSchema(
                id=x[0], 
                platform = 'Steam' if x[1] == 'steam' else 'Epic',
                username = x[2],
                date_created = x[3] if x[3] else 0,
                n_replays = x[4] if x[4] else 0,
                n_wins = x[5] if x[5] else 0,
                n_losses = x[6] if x[6] else 0,
                n_goals = x[7] if x[7] else 0,
                n_assists = x[8] if x[8] else 0,
                n_saves = x[9] if x[9] else 0,
                n_shots = x[10] if x[10] else 0,
            ) for x in self.db.get_users(skip, limit, platform, username)
        ]

        return result