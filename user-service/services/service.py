from schemas.schema import UserSchema
from util.service import Service
from datetime import datetime

class UserService(Service):
    def get_users(self, db_parametrs: any) -> list[UserSchema]:
        result = [
            UserSchema(*x) for x in self.db.get_users(db_parametrs)
        ]
        return result

    def get_user(self, user_id: int) -> UserSchema | None:
        user = self.db.get_user(user_id)
        return None if user is None else UserSchema(*user)

    def create_user(self, user_data: any) -> UserSchema | None:
        user_values = UserSchema(**user_data, date_created=datetime.today().strftime('%Y-%m-%d'))
        
        if self.db.create_user(user_values.__dict__):
            return user_values
        return None