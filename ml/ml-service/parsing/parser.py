from boxcars_py import parse_replay
from carball.analysis.analysis_manager import AnalysisManager
from carball.json_parser.game import Game

from fastapi import UploadFile

def boxcars_parse(file: UploadFile):
    return parse_replay(file.file.read())

def carball_parse(file: UploadFile):
    _json = boxcars_parse(file)
    game = Game()
    game.initialize(loaded_json=_json)
    analysis = AnalysisManager(game)
    analysis.create_analysis()
    return analysis