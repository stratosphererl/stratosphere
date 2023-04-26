from util.result import ServiceResponseError, ServiceResponseSuccess, ServiceResponsePage
from schemas.forms import ReplayUpdateForm
import json

from datetime import datetime

class ReplayService():

    HEADER_KEY = "gameHeader"

    @staticmethod
    def available_filters(): 
        return {
            "name": f"{ReplayService.HEADER_KEY}.name",
            "map": f"{ReplayService.HEADER_KEY}.map.name",
            "gameMode": f"{ReplayService.HEADER_KEY}.gameMode",
            "gameType": f"{ReplayService.HEADER_KEY}.gameType",
            "region": f"{ReplayService.HEADER_KEY}.region",
            "season": f"{ReplayService.HEADER_KEY}.season.name",
            "duration": f"{ReplayService.HEADER_KEY}.length",
            "rank": f"{ReplayService.HEADER_KEY}.players.rank.title",
            "player": f"{ReplayService.HEADER_KEY}.players.name",
        }
    
    @staticmethod
    def _field_mapper(field, value):
        field_to_search = {
            f"{ReplayService.HEADER_KEY}.name": {"$regex": f".*{value}.*", "$options": "i"},
            f"{ReplayService.HEADER_KEY}.map.name": value,
            f"{ReplayService.HEADER_KEY}.gameMode": value,
            f"{ReplayService.HEADER_KEY}.gameType": value,
            f"{ReplayService.HEADER_KEY}.region": value,
            f"{ReplayService.HEADER_KEY}.season.name": value,
            f"{ReplayService.HEADER_KEY}.length": {"$gte": value['gte'] if isinstance(value, dict) else value, "$lte": value['lte'] if isinstance(value, dict) else value},
            f"{ReplayService.HEADER_KEY}.players.rank.title": {"$regex": f"^{value}.*", "$options": "i"},
            f"{ReplayService.HEADER_KEY}.players.name": {"$regex": f".*{value}.*", "$options": "i"},
        }

        return field_to_search.get(field)
    
    def __init__(self, repository):
        self.repository = repository

    def get_replay(self, id):
        try:
            return ServiceResponseSuccess(
                data=[self.repository.get(id)]
            )
        except Exception as e:
            return ServiceResponseError(error="Replay not found", message=str(e))
            
    def get_replays(self, page=0, limit=50):
        try:
            replays = list(self.repository.paginate_filter(page, limit, {}))
        except:
            return ServiceResponseError(error="Replays not found", message="Replays not found")
        
        return ServiceResponsePage(
            data=[replay[ReplayService.HEADER_KEY] for replay in replays],
            page=page,
            total=len(replays)
        )

    def search(self, 
               page=0, 
               limit=50, filters = {}):
        try:
            print(filters)
            filters = {self.available_filters()[key]: self._field_mapper(self.available_filters()[key], value) for key, value in filters.items()}
            replays = list(self.repository.paginate_filter(page, limit, filters))
        except Exception as e:
            return ServiceResponseError(error="Replays not found", message=f"Replays not found: {e}")
        return ServiceResponsePage(
            data=[replay[ReplayService.HEADER_KEY] for replay in replays],
            page=page,
            total=len(replays)
        )

    def add_replay(self, replay):
        try:
            return ServiceResponseSuccess(
                data=[{"result": replay}]
            )
        except Exception as e:
            return ServiceResponseError(error="Replay not added", message=str(e))

    def update_replay(self, id, by: ReplayUpdateForm):
        try:
            replay = self.repository.get(id)
            replay[ReplayService.HEADER_KEY]['name'] = by.name
            return ServiceResponseSuccess(
                data=[{"result": self.repository.update(id, replay)}]
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
    
    @staticmethod
    def get_options():
        return {
            "options": {
                "maps": GET_MAPS(),
                "seasons": GET_SEASONS(),
                "ranks": GET_RANKS(),
                "gameModes": GAMEMODES,
                "regions": REGIONS,
                "gameTypes": OFFICAL_GAME_TYPES
            }
        }
    
    def get_region_pop_stats(self):
        pipeline = [
            {
                "$group": {
                    "_id": "$gameHeader.region",
                    "count": { "$sum": 1 },
                },
            },
            {
                "$addFields": {
                    "currentDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                },
            },
            {
                "$group": {
                    "_id": "$currentDate",
                    "regions": { "$push": { "region": "$_id", "count": "$count" } },
                },
            },
        ]

        return ServiceResponseSuccess(
            data=[{"result": list(self.repository.aggregate(pipeline))}]
        )
    
    def get_season_pop_stats(self):
        pipeline = [
            {
                "$group": {
                    "_id": "$gameHeader.season.name",
                    "count": { "$sum": 1 },
                },
            },
            {
                "$addFields": {
                    "currentDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                },
            },
            {
                "$group": {
                    "_id": "$currentDate",
                    "regions": { "$push": { "region": "$_id", "count": "$count" } },
                },
            },
        ]
        return ServiceResponseSuccess(
            data=[{"result": list(self.repository.aggregate(pipeline))}]
        )
    
    def get_rank_pop_stats(self):
        pipeline = [
            { "$unwind": "$gameHeader.players" },
            {
                "$match": {
                    "gameHeader.players.isBot": { "$ne": True },
                },
            },
            {
                "$group": {
                    "_id": "$gameHeader.players.rank.title",
                    "count": { "$sum": 1 },
                },
            },
            {
                "$addFields": {
                    "currentDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                },
            },
            {
                "$group": {
                    "_id": "$currentDate",
                    "ranks": { "$push": { "rank": "$_id", "count": "$count" } },
                },
            },
        ]

        return ServiceResponseSuccess(
            data=[{"result": list(self.repository.aggregate(pipeline))}]
        )
    
    def get_duration_pop_stats(self):
        pipeline = [
            {
                "$bucket": {
                    "groupBy": "$gameHeader.length",
                    "boundaries": [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, float("inf")],
                    "default": "Other",
                    "output": {
                        "count": { "$sum": 1 },
                    },
                },
            },
            {
                "$addFields": {
                    "currentDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                },
            },
            {
                "$group": {
                    "_id": "$currentDate",
                    "durations": { "$push": { "duration": "$_id", "count": "$count" } },
                },
            },
        ]
        return ServiceResponseSuccess(
            data=[{"result": list(self.repository.aggregate(pipeline))}]
        )

    def get_platform_pop_stats(self):
        pipeline = [
            { "$unwind": "$gameHeader.players" },
            {
                "$group": {
                    "_id": "$gameHeader.players.platform",
                    "count": { "$sum": 1 },
                },
            },
            {
                "$addFields": {
                    "currentDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                },
            },
            {
                "$group": {
                    "_id": "$currentDate",
                    "platforms": { "$push": { "platform": "$_id", "count": "$count" } },
                },
            },
        ]

        return ServiceResponseSuccess(
            data=[{"result": list(self.repository.aggregate(pipeline))}]
        )


def GET_MAPS():
    MAPS = set()
    with open('resource/map.json') as json_file:
        maps_json = json.load(json_file)

        for map in maps_json:
            MAPS.add(map['Map Base Name'])
    
    return list(MAPS)

def GET_SEASONS():
    SEASONS = []
    with open('resource/season.json') as json_file:
        seasons_json = json.load(json_file)

        for season in seasons_json['seasons']:
            SEASONS.append(season['name'])
    
    return SEASONS

def GET_RANKS():
    RANKS = []
    with open('resource/rank.json') as json_file:
        ranks_json = json.load(json_file)

        for rank_id in ranks_json['Duel']:
            for _ in ranks_json['Duel'][f"{rank_id}"]:
                RANKS.append(ranks_json['Duel'][f"{rank_id}"]['name'])

    return RANKS

MATCH_TYPES = ['Offline', 'Private', 'Online', 'LAN', 'Season', 'Tournament', 'FaceIt']
OFFICAL_GAME_TYPES = ['Duels', 'Doubles', 'Standard', 'Chaos']
REGIONS = [
        'US-East',
        'US-West',
        'Europe',
        'Oceania',
        'Asia East',
        'Asia South-East (Maritime)',
        'Asia South-East (Mainland)',
        'Middle East',
        'South Africa',
        'South America',
        'India'
]
GAMEMODES = [
    'Soccar',
    'Hoops',
    'Rumble',
    'Dropshot',
    'Snow Day',
    'Heat Seeker',
    'Gridiron',
    'Ghost Hunt',
    'Season',
    'Spike Rush',
    'Spooky Cube',
    'Dropshot Rumble',
    'Rocket Labs',
    'Anniversary',
]