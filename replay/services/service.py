from schemas.parsed_replay import DetailedReplay, ReplayHeader
from pydantic.tools import parse_obj_as
import json
from config.database import collection 
from repository.ReplayRepository import ReplayRepository
from util.generateData import DetailedReplayFactory

class ReplayService():
    def get_replays(self):
        repository = ReplayRepository(collection)
        return repository.paginateAndFilter(1, 10, {"gameMetadata.name": {"$regex": "Long ", "$options": "i"}})

# import http.client

# conn = http.client.HTTPSConnection("www.jsonkeeper.com")

# payload = ""

# headers = {
#     'cookie': "amber.session=eyJfZmxhc2giOiJ7fSJ9--0C2vcgFqVbFBZoDC1tR0QGmaZY8%253D",
#     'Authorization': "qS6MDfRX0l8r9P2jqSafqyijE3oomEOb7fsHupfW"
#     }

# conn.request("GET", "/b/RDE5", payload, headers)

# res = conn.getresponse()
# data = res.read()

# replay = parse_obj_as(DetailedReplay, json.loads(data.decode("utf-8")))

# db.insert_one(replay.dict())

# document = db.find_one({"_id": "BF04CC604DC7873E642581AE58326498"})

# replay = parse_obj_as(DetailedReplay, document)

result = DetailedReplayFactory