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
            UserService._create_user_schema(x) for x in self.db.get_users(skip, limit, platform, username)
        ]

        return result

    def get_user(self, user_id: int) -> UserSchema:
        return UserService._create_user_schema(self.db.get_user(user_id))

    def _create_user_schema(user_data: tuple):
        return UserSchema(
            id = user_data[0],
            platform = 'Steam' if user_data[1] == 'steam' else 'Epic',
            username = user_data[2],
            date_created = user_data[3] if user_data[3] else 0,
            n_replays = user_data[4] if user_data[4] else 0,
            n_wins = user_data[5] if user_data[5] else 0,
            n_losses = user_data[6] if user_data[6] else 0,
            n_goals = user_data[7] if user_data[7] else 0,
            n_assists = user_data[8] if user_data[8] else 0,
            n_saves = user_data[9] if user_data[9] else 0,
            n_shots = user_data[10] if user_data[10] else 0,
        )