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

logger = logging.getLogger(__name__)

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
        id, raw_replay = boxcars_parse(path)
        
        if os.path.exists(f"./files/{id}"):
            alreadyExists = True
            raise Exception("Replay already exists")
        else:
            os.mkdir(f"./files/{id}")

        logging.info(f"Analyzing replay file: {path}")
        
        with open(f"./files/{id}/{id}_boxcars.json", "w") as f:
            json.dump(raw_replay, f)

        mmr = extract_mmr(raw_replay['debug_info'])

        try:
            parsed_replay = carball_parse(path, id)
        except:
            raise Exception("Failed to analyze replay")

        if mmr:
            parsed_replay['mmr'] = mmr

        with open(f"./files/{id}/{id}_carball.json", "w") as f:
            json.dump(parsed_replay, f)
        
        shutil.copyfile(path, f"./files/{id}/{id}.replay")

        end_time = time.time()
        execution_time = end_time - start_time

        assert parsed_replay['gameMetadata']['id'] == id

        try:
            # ReplayRepository(collection).add(DetailedReplay(**parsed_replay))
            pass
        except Exception as e:
            logging.error(f"Failed to save replay to database: {e}")
            raise(e)
        
        logging.info(f"Replay file {path} saved to database successfully")

        return {
            "id": id,
            "timeallotted": f"{execution_time:.3f}"
        }

    except Exception as e:
        if alreadyExists:
            logging.info(f"Replay file {path} already exists")
            os.remove(path)
        else:
            shutil.rmtree(f"./files/{id}")
            # os.remove(path)

        raise(e)
    
    logging.info(f"Replay file {path} processed successfully")
    os.remove(path)

    # Use service to send to frontend

def boxcars_parse(path):
    from boxcars_py import parse_replay

    with open(path, "rb") as f:
        raw_replay = parse_replay(f.read())
        id = raw_replay['properties']['Id']
        
        return (id, raw_replay)

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
    
    return mmr