from pydantic_factories import ModelFactory
from ..schemas.parsed_replay import DetailedReplay

class DetailedReplayFactory(ModelFactory):
    __model__ = DetailedReplay