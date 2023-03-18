from schemas.parsed_replay import DetailedReplay, ReplayHeader
from util.result import ServiceResponseError, ServiceResponseSuccess, ServiceResponsePage
from schemas.forms import ReplayUpdateForm

class ReplayService():

    @staticmethod
    def available_filters(): 
        return {
            "name": "gameMetadata.name",
            "map": "gameMetadata.map",
            "gameMode": "gameMetadata.playlist",
            "teamSize": "gameMetadata.teamSize",
            "players": "players",
            "length": "gameMetadata.length",
            "region": "gameMetadata.serverName",
            "date": "gameMetadata.time"
        }
    
    @staticmethod
    def _field_mapper(field, value):
        field_to_search = {
            "gameMetadata.name": {"$regex": f".*{value}.*", "$options": "i"},
            "gameMetadata.map": {"$regex": f".*{value}.*", "$options": "i"},
            "gameMetadata.playlist": {"$regex": f".*{value}.*", "$options": "i"},
            "gameMetadata.teamSize": {"$gt": value, "$lt": value},
            "players": {"$elemMatch": {"id.id": value}},
            "gameMetadata.length": {"$lte": value},
            "gameMetadata.serverName": {"$regex": f"^{value}$", "$options": "i"},
            "gameMetadata.time": {"$lte": value}
        }

        return field_to_search.get(field)
    
    def __init__(self, repository):
        self.repository = repository

    def get_replay(self, id):
        try:
            return ServiceResponseSuccess(
                data=[DetailedReplay(**self.repository.get(id))]
            )
        except Exception as e:
            return ServiceResponseError(error="Replay not found", message=str(e))
            
    def get_replays(self, page=0, limit=50):
        try:
            replays = list(self.repository.paginate_filter(page, limit, {}))
        except:
            return ServiceResponseError(error="Replays not found", message="Replays not found")
        
        return ServiceResponsePage(
            data=[ReplayHeader(**replay['gameMetadata']) for replay in replays],
            page=page,
            total=len(replays)
        )

    def search(self, 
               page=0, 
               limit=50, filters = {}):
        try:
            filters = {self.available_filters()[key]: self._field_mapper(self.available_filters()[key], value) for key, value in filters.items()}
            print(filters)
            replays = list(self.repository.paginate_filter(page, limit, filters))
        except Exception as e:
            return ServiceResponseError(error="Replays not found", message=f"Replays not found: {e}")
        return ServiceResponsePage(
            data=[ReplayHeader(**replay['gameMetadata']) for replay in replays],
            page=page,
            total=len(replays)
        )

    def add_replay(self, replay):
        try:
            return ServiceResponseSuccess(
                data=[{"result": self.repository.add(DetailedReplay(**replay))}]
            )
        except Exception as e:
            return ServiceResponseError(error="Replay not added", message=str(e))

    def update_replay(self, id, by: ReplayUpdateForm):
        try:
            replay = self.repository.get(id)
            replay['gameMetadata']['name'] = by.name
            return ServiceResponseSuccess(
                data=[{"result": self.repository.update(id, DetailedReplay(**replay))}]
            )
        except Exception as e:
            return ServiceResponseError(error="Replay not updated", message=str(e))

    def delete_replay(self, id):
        try:
            return ServiceResponseSuccess(
                data=[{"result": self.repository.delete(id)}]
            )
        except Exception as e:
            return ServiceResponseError(error="Replay not deleted", message=str(e))

    def get_replays_count(self):
        return ServiceResponseSuccess(
            data=[{"count": self.repository.count()}]
        )