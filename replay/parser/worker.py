from celery import Celery
import json 
import shutil
import os
from celery.signals import worker_ready
import logging

from config.database import collection
from repository.ReplayRepository import ReplayRepository
import time
from datetime import datetime



# worker container has no parser module so we need to import from the correct location
if os.getenv("PARSER"):
    from helper import date2season, filename2map, debug2mmr, mmr2rank
    from parsing import carball_parse, boxcars_parse
else:
    from parser.helper import date2season, filename2map, debug2mmr, mmr2rank
    from parser.parsing import carball_parse, boxcars_parse
    

logger = logging.getLogger(__name__)

logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)

repo = ReplayRepository(collection)

celery = Celery(__name__,
                backend="redis://redis:6379",
                broker="redis://redis:6379")

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
        elif len(os.listdir(f"./files/{folder}")) < 4:
            logging.debug(f"Incomplete replay detected. Removing folder {folder}")
            shutil.rmtree(f"./files/{folder}")

def generate_task_meta(id, stage, current_stage_num, process_time=None, total_stages=4):
    return {
        "replay_id": f"{id}",
        "process_time": process_time,
        "stage": {
            "name": stage,
            "current": current_stage_num,
            "total": total_stages
        }
    }

@celery.task(name="parse", bind=True)
def parse(self, path):
    start_time = time.time()

    id = None
    alreadyExists = False

    logging.debug(f"Processing {path}")

    try:
        logging.info(f"Parsing raw replay file: {path}")
        self.update_state(state="PROGRESS", meta=generate_task_meta(self, id, "PARSE", 1))
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
        self.update_state(state="PROGRESS", meta=generate_task_meta(self, id, "ANALYZE", 2))
        with open(f"./files/{id}/{id}_boxcars.json", "w") as f:
            json.dump(raw_replay, f)

        try:
            am = carball_parse(path)
            parsed_replay = am.get_json_data()
        except Exception as e:
            raise Exception(f"Failed to analyze replay: {e}")

        self.update_state(state="PROGRESS", meta=generate_task_meta(self, id, "STITCH", 3))
        
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
            detailedReplay = parsed_replay
            detailedReplay['_id'] = id
            repo.add(detailedReplay)
            pass
        except Exception as e:
            logging.error(f"Failed to save replay to database: {e}")
            raise(e)
        
        logging.info(f"Replay file {path} saved to database successfully")
        self.update_state(state="SUCCESS", meta=generate_task_meta(id, "SAVE", 4, process_time=f"{execution_time:.3f}s"))

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
    ranks = debug2mmr(parsedReplay['debug_info'], playlist)

    replay['gameMetadata']['ranks'] = ranks

def export_frames(df, path):
    unwanted_cols = [
        'ping', 
        'ang_vel_x', 
        'ang_vel_y',
        'ang_vel_z',
        'throttle',
        'steer',
        'handbrake',
        'rotation_y',
        'rotation_z',
        'jump_active',
        'double_jump_active',
        'dodge_active',
        'ball_cam',
        'delta',
        'seconds_remaining',
        'replicated_seconds_remaining',
        'ball_has_been_hit',
        'goal_number',
        'boost_collect',
    ]

    for col in df.columns:
        if col[1] in unwanted_cols:
            df.drop((col[0], col[1]),  axis=1, inplace=True)

    df.to_csv(path, index=False, compression="gzip")