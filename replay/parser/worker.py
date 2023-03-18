from celery import Celery
import json 
import shutil
import os
from celery.signals import worker_ready
import logging

from config.database import collection
from repository.ReplayRepository import ReplayRepository
from schemas.parsed_replay import DetailedReplay
import time
from datetime import datetime

# worker container has no parser module so we need to import from the correct location
if os.getenv("PARSER"):
    from helper import date2season, filename2map, debug2mmr, mmr2rank
else:
    from parser.helper import date2season, filename2map, debug2mmr, mmr2rank

logger = logging.getLogger(__name__)
repo = ReplayRepository(collection)

def extract_mmr(debug_info):
    mmr = {
        "average": None,
        "players": {},
    }

    for player in debug_info:
        if player['user'].startswith("MMR"):
            player_id = player['user'].split("|")[1]
            if player_id not in mmr:
                mmr['players'][player_id] = {}
            mmr['players'][player_id]['platform'] = player['user'].split("|")[0].split(":")[1]
            
            isPre =  True if "PRE" in player['user'] else False
            mmr_value = float(player['text'].split("|")[0])
            if isPre:
                mmr['players'][player_id]['pre'] = mmr_value
            else:
                mmr['players'][player_id]['post'] = mmr_value
    
    if mmr['players']:
        acutal_mmr_count = 0
        mmr["average"] = 0
        
        for player in mmr['players']:
            if 'pre' in mmr['players'][player]:
                mmr['average'] += mmr['players'][player]['pre']
                print(mmr['average'])
                acutal_mmr_count += 1
            if 'post' in mmr['players'][player]:
                mmr['average'] += mmr['players'][player]['post']
                print(mmr['average'])
                acutal_mmr_count += 1
                
        mmr['average'] = mmr['average'] / acutal_mmr_count

def carball_parse(path):
    import carball
    from carball.json_parser.game import Game
    from carball.analysis.analysis_manager import AnalysisManager

    _json = carball.decompile_replay(path)
    game = Game()
    game.initialize(loaded_json=_json)

    analysis_manager = AnalysisManager(game)
    analysis_manager.create_analysis()

    parsed_replay = analysis_manager.get_json_data()
    
    return parsed_replay


def boxcars_parse(path):
    from boxcars_py import parse_replay

    with open(path, "rb") as f:
        raw_replay = parse_replay(f.read())
        id = raw_replay['properties']['Id']
        
        return (id, raw_replay)

stages = (boxcars_parse, carball_parse, extract_mmr)

@worker_ready.connect
def at_start(sender, **k):
    """
    Clean up files directory on startup, that were not deleted properly
    """
    for file in os.listdir("./files"):
        if not os.path.isdir(f"./files/{file}"):
            logging.debug(f"Unprocessed file detected. Removing file {file}")
            os.remove(f"./files/{file}")
    
    for folder in os.listdir("./files"):
        if not os.listdir(f"./files/{folder}"):
            logging.debug(f"Empty folder detected. Removing folder {folder}")
            os.rmdir(f"./files/{folder}")
        elif len(os.listdir(f"./files/{folder}")) < 3:
            logging.debug(f"Incomplete replay detected. Removing folder {folder}")
            shutil.rmtree(f"./files/{folder}")

celery = Celery(__name__,
                backend="redis://redis:6379",
                broker="redis://redis:6379")

@celery.task(name="parse", bind=True)
def parse(self, path):
    start_time = time.time()

    id = None
    alreadyExists = False

    logging.debug(f"Processing {path}")

    try:
        logging.info(f"Parsing raw replay file: {path}")
        self.update_state(state="PROGRESS", meta={
            "replay_id": f"{id}",
            "process_time": None,
            "stage": {
                "name": "PARSE",
                "current": 1,
                "total": 4
            }
        })
        id, raw_replay = boxcars_parse(path)

        try:
            replay_exists_db = bool(repo.get(id))
        except:
            replay_exists_db = False
        
        if os.path.exists(f"./files/{id}") and replay_exists_db:
            alreadyExists = True
            raise Exception("Replay already exists")         
        else:
            os.mkdir(f"./files/{id}")

        logging.info(f"Analyzing replay file: {path}")
        self.update_state(state="PROGRESS", meta={
            "replay_id": f"{id}",
            "process_time": None,
            "stage": {
                "name": "ANALYZE",
                "current": 2,
                "total": 4
            }
        })
        with open(f"./files/{id}/{id}_boxcars.json", "w") as f:
            json.dump(raw_replay, f)

        try:
            parsed_replay = carball_parse(path)
        except Exception as e:
            raise Exception(f"Failed to analyze replay: {e}")
        
        self.update_state(state="PROGRESS", meta={
            "replay_id": f"{id}",
            "process_time": None,
            "stage": {
                "name": "STITCH",
                "current": 3,
                "total": 4
            }
        })
        
        addMap(parsed_replay)

        addSeason(parsed_replay)

        addUploadDate(parsed_replay)

        addRanks(parsed_replay, raw_replay)
        
        with open(f"./files/{id}/{id}_carball.json", "w") as f:
            json.dump(parsed_replay, f)
        
        shutil.copyfile(path, f"./files/{id}/{id}.replay")

        end_time = time.time()
        execution_time = end_time - start_time

        assert parsed_replay['gameMetadata']['id'] == id

        try:
            detailedReplay = DetailedReplay(**parsed_replay)
            detailedReplay.update_forward_refs()
            repo.add(detailedReplay)
            pass
        except Exception as e:
            logging.error(f"Failed to save replay to database: {e}")
            raise(e)
        
        logging.info(f"Replay file {path} saved to database successfully")
        self.update_state(state="SUCCESS", meta={
            "replay_id": f"{id}",
            "process_time": f"{execution_time:.3f}s",
            "stage": {
                "name": "SAVE",
                "current": 4,
                "total": 4
            }
        })

    except Exception as e:
        # if alreadyExists:
        #     logging.info(f"Replay file {path} already exists")
        #     os.remove(path)
        # else:
        #     if os.path.exists(f"./files/{id}"):
        #         shutil.rmtree(f"./files/{id}")
        #         os.remove(path)
        raise(e)

def addUploadDate(replay):
    replay['gameMetadata']['uploadDate'] = str(datetime.now().timestamp())


def addMap(replay):
    replay['gameMetadata']['map'] = dict(filename2map(replay['gameMetadata']['map']))


def addSeason(replay):
    if replay['gameMetadata']['time'].isdigit():
        time = int(replay['gameMetadata']['time'])
        replay['gameMetadata']['season'] = dict(date2season(datetime.utcfromtimestamp(time)))
    else:
        replay['gameMetadata']['season'] = None

def addRanks(replay, parsedReplay):
    playlist = replay['gameMetadata']['playlist']
    # weird bug here, sometimes the ranks aren't processed correctly
    ranks = debug2mmr(parsedReplay['debug_info'], playlist)

    replay['gameMetadata']['ranks'] = ranks