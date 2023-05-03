from celery import Celery
import shutil
import os
from celery.signals import worker_ready, worker_shutdown
import logging

from config.database import collection
from repository.ReplayRepository import ReplayRepository
import time
from datetime import datetime

import traceback

# worker container has no parser module so we need to import from the correct location
if os.getenv("PARSER"):
    from StratosphereParser import StratosphereParser, ParsingHelper
else:
    from parser.StratosphereParser import StratosphereParser, ParsingHelper
    

logger = logging.getLogger(__name__)

logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)

repo = ReplayRepository(collection)

celery = Celery(__name__,
                backend="redis://redis:6379",
                broker="redis://redis:6379")

def clean_up_fs():
    for file in os.listdir("./files"):
        if not os.path.isdir(f"./files/{file}"):
            logging.debug(f"Unprocessed file detected. Removing file {file}")
            os.remove(f"./files/{file}")
    
    for folder in os.listdir("./files"):
        if not os.listdir(f"./files/{folder}"):
            logging.debug(f"Empty folder detected. Removing folder {folder}")
            os.rmdir(f"./files/{folder}")
        elif not replay_has_hidden_done_file(f"./files/{folder}"):
            logging.debug(f"Unprocessed folder detected. Removing folder {folder}")
            shutil.rmtree(f"./files/{folder}")

@worker_ready.connect
def at_start(sender, **k):
    """
    Clean up files directory on startup, that were not deleted properly
    """
    clean_up_fs()

@worker_shutdown.connect
def at_end(sender, **k):
    """
    Clean up files directory on shutdown, that were not deleted properly
    """
    clean_up_fs()

def add_hidden_done_file(path):
    """
    Add a hidden file to the replay folder to indicate that the replay is done processing
    """
    with open(f"{path}/.done", "w") as f:
        f.write("done")

def replay_has_hidden_done_file(path):
    """
    Check if the replay has a hidden done file
    """
    return os.path.exists(f"{path}/.done")

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


def pretty_format_exception(e):
    return ''.join(traceback.format_exception(type(e), e, e.__traceback__))


def persist_data(id, callbacks = []):
    """
    Persist replay to file system
    """

    for callback in callbacks:
        callback()

    add_hidden_done_file(f"./files/{id}")

def save_frames_if_exists(am):
    import pandas as pd
    if not am: return
    if not isinstance(am.game.frames, pd.DataFrame) or not am.game.frames.empty:
        ParsingHelper.export_frames_as_zipped_csv(am.get_data_frame(), f"./files/{am.game.id}/{am.game.id}_frames.csv")

def save_replay_to_fs(id, path):
    if not os.path.exists(f"./files/{id}"):
        os.mkdir(f"./files/{id}")
    shutil.copy(path, f"./files/{id}/{id}.replay")
    os.remove(path)

@celery.task(name="parse", bind=True)
def parse2(self, path):
    s_time = time.time()
    id = None

    # initialize parser
    sp = StratosphereParser(path)

    self.update_state(state="PROGRESS", meta=generate_task_meta(id, "PARSE", 1))
    sp.get_decompile()
    sp.get_game()
    
    id = sp.game.id

    try:
        replay_exists_db = bool(repo.get(id))
    except:
        replay_exists_db = False


    if os.path.exists(f"./files/{id}") and replay_exists_db:
        raise Exception("Replay already exists")

    try:
        self.update_state(state="PROGRESS", meta=generate_task_meta(id, "ANALYZE", 2))
        sp.perform_analysis()
    except Exception as e:
        raise Exception(f"Failed to analyze replay: {pretty_format_exception(e)}")

    self.update_state(state="PROGRESS", meta=generate_task_meta(id, "STITCH", 3))
    sp.amend_game(sp.game)

    try:
        json = sp.get_json_data()
        persist_data(id, callbacks=[lambda: save_replay_to_fs(id, path), lambda: save_frames_if_exists(sp.am)])
        repo.add(json)
        
        e_time = time.time()
        execution_time = e_time - s_time

        self.update_state(state="SUCCESS", meta=generate_task_meta(id, "SAVE", 4, process_time=f"{execution_time:.3f}s"))
        
    except Exception as e:
        raise Exception(f"Failed to save replay to database: {pretty_format_exception(e)}")