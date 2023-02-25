from schemas.schema import UserSchema
from util.service import Service
from datetime import datetime

from loguru import logger

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
    
    def update_user(self, update_values: dict, id: int) -> UserSchema | None:
        current_user = self.get_user(id)
        if current_user is None:
            # TODO: Replace this with a more accurate error message
            return None
        current_user.__dict__.update(**update_values)
        update_values = list(current_user.__dict__.values())
        update_values.pop(0)
        update_values = tuple(update_values) # Gets all values of user excluding id
        if self.db.update_user(update_values, id):
            return current_user
        return None
    
    def delete_user(self, user_id: int) -> UserSchema | None:
        result = self.db.delete_user(user_id)
        return result if result is None else UserSchema(*result)