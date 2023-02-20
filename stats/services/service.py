from schemas.schema import CountSchema
from util.service import Service
from config.database import Database

class StatsClass(Service):
    # def get_example(self, example_id: int) -> ExampleSchema:
    #     # result = self.db.example.find_one({"id": example_id})
    #     example = ExampleSchema(name="Foo", age=42)
    #     return example
    
    ### Methods for replay counts ###

    def get_replay_count_all(self) -> CountSchema:
        return CountSchema(count = self.db.get_replay_count_all())
    
    def get_replay_count_arena(self, arena_num) -> CountSchema:
        return CountSchema(count = self.db.get_replay_count_arena(arena_num))
    
    def get_replay_count_duration(self, min_duration, max_duration) -> CountSchema:
        return CountSchema(count = self.db.get_replay_count_duration(min_duration, max_duration))

    def get_replay_count_rank(self, low_rank_num, high_rank_num) -> CountSchema:
        return CountSchema(count = self.db.get_replay_count_rank(low_rank_num, high_rank_num))
    
    def get_replay_count_season(self, low_season_num, high_season_num) -> CountSchema:
        return CountSchema(count = self.db.get_replay_count_season(low_season_num, high_season_num))
    
    ### Methods for user counts ###

    def get_user_count_all(self) -> CountSchema:
        return CountSchema(count = self.db.get_user_count_all())
    
    def get_user_count_platform(self, platform_num) -> CountSchema:
        return CountSchema(count = self.db.get_user_count_platform(platform_num))
    
    def get_user_count_rank(self, low_rank_num, high_rank_num) -> CountSchema:
        return CountSchema(count = self.db.get_user_count_rank(low_rank_num, high_rank_num))
    
    ### Utility methods for allowing only valid values ###
    
    def get_valid_range(self, table_name) -> set:
        return self.db.get_valid_range(table_name)
