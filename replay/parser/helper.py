import json
import datetime 
import logging
import os
import traceback
import re

def useLogging(name: str, level=logging.WARNING):
    logger = logging.getLogger(__name__)
    handler = logging.StreamHandler()

    formatter = logging.Formatter('LOG: %(name)s[%(levelname)s] @ %(asctime)s: %(message)s')

    logger.setLevel(level)
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger

__name__ = "parser.helper"

logger = useLogging(__name__)

MAP_JSON = "resource/map.json"
RANK_JSON = "resource/rank.json"
SEASON_JSON = "resource/season.json"

if not os.getenv("DOCKER_RUNNING"):
    logger.debug("Not running in docker. Setting paths relative to this file.")

    MAP_JSON = f"../{MAP_JSON}"
    RANK_JSON = f"../{RANK_JSON}"
    SEASON_JSON = f"../{SEASON_JSON}"

class BadFormatException(Exception):
    """
    Raised when the format of the data is incorrect.
    """
    def __init__(self, message):
        self.message = message

# translatation of playlist names to the names used in the json files
SUPPORTED_PLAYLISTS = {
    "duel": "Duel",
    "doubles": "Doubles",
    "standard": "Standard",
    "hoops": "Hoops",
    "rumble": "Rumble",
    "dropshot": "Dropshot",
    "snow day": "Snow Day",
    "tournament": "Tournament",
}

def date2season(date: datetime.datetime):
def date2season(date: datetime.datetime):
    """
    Converts a date to a season name and id.

    Assumes particular format of the season.json file.

    Parameters
    ----------
    date : datetime
        The date to convert.
    
    Returns
    -------
    Season

    Raises
    ------
    BadFormatException

    Examples
    --------
    """

    seasonName = None
    id = -1

    try: 
        with open(SEASON_JSON, "r") as f:
            seasons = json.load(f)['seasons']
    except Exception as e:
        raise BadFormatException(f"Unable to load seasons data: {e}")

    for season in seasons:
        try:
            start = datetime.datetime.fromtimestamp(season["startDate"])
            end = datetime.datetime.fromtimestamp(season["endDate"])
        except:
            raise BadFormatException("Unable to parse season data. Check the format of start and end dates.")

        try:
            if start <= date <= end:
                    seasonName = season["name"]
                    id = season["id"]
                
            elif date > end:
                seasonName = season["name"]
                id = season["id"]

        except:
            raise BadFormatException("Unable to parse season data. Check the format of name.")
    
    if seasonName is None and id == -1:
        logger.warning("Unable to find season for date: %s.", date)
        
    return {
        "id": id,
        "name": seasonName
    }

def mmr2rank(mmr : float, playlist):
def mmr2rank(mmr : float, playlist):
    if isinstance(mmr, str):
        mmr = float(mmr)
    """
    Parses the mmr and playlist to find the rank and division.

    Assumes particular format of the rank.json file.

    Parameters
    ----------
    mmr : int
        The mmr to parse.
    playlist 
        The playlist to derive ranking from.
    
    Returns
    -------
    Rank

    Raises
    ------
    BadFormatException
    """
    id = -1
    rankName = None
    divisionName = None
    previousRank = None
    previousRankId = None
    previousDivision = None

    try:
        with open(RANK_JSON, "r") as f:
            ranks = json.load(f)
    except Exception as e:
        raise BadFormatException(f"Unable to load ranks data: {e}")
    
    if not playlist in ranks:
        raise BadFormatException(f"Unable to find supported playlist {playlist} in rank data. Supported playlists: {', '.join(ranks.keys())}")
    if not playlist in ranks:
        raise BadFormatException(f"Unable to find supported playlist {playlist} in rank data. Supported playlists: {', '.join(ranks.keys())}")
    
    for rank_id in ranks[playlist]:
        rank = ranks[playlist][rank_id]

        if "divisions" not in rank:
            raise BadFormatException(f"Unable to find divisions in rank data for playlist {playlist} and rank {rank_id}")
            raise BadFormatException(f"Unable to find divisions in rank data for playlist {playlist} and rank {rank_id}")
        
        divisions = rank["divisions"]

        for division_id in divisions.keys():
            division = divisions[division_id]
            
            if "start" not in division or "end" not in division:
                raise BadFormatException(f"Unable to find start or end in division data for playlist {playlist}, rank {rank_id} and division {division_id}")
                raise BadFormatException(f"Unable to find start or end in division data for playlist {playlist}, rank {rank_id} and division {division_id}")

    
            # Special case, there is no end range for the highest rank
            if rank['name'] == "Supersonic Legend" and mmr >= divisions[division_id]["start"]:
                divisionName = division["name"]
                rankName = rank['name']
                id = int(rank_id)
        
            elif divisions[division_id]["start"] <= mmr <= divisions[division_id]["end"]:

                if "name" not in rank or "name" not in division:
                    raise BadFormatException(f"Unable to find name in rank or division data for playlist {playlist}, rank {rank_id} and division {division_id}")
                    raise BadFormatException(f"Unable to find name in rank or division data for playlist {playlist}, rank {rank_id} and division {division_id}")

                rankName = rank['name']
                divisionName = division["name"]
                id = int(rank_id)
                break
            elif (bool (previousRank and previousDivision)) and (previousDivision['end'] <= mmr <= divisions[division_id]["start"]):
                if "name" not in rank or "name" not in division:
                    raise BadFormatException(f"Unable to find name in rank or division data for playlist {playlist}, rank {rank_id} and division {division_id}")

                rankName = previousRank['name']
                divisionName = previousDivision["name"]
                id = int(previousRankId)
                break
            
            previousDivision = division
            previousRank = rank
            previousRankId = rank_id
    
        if rankName: 
            break

    return {"id": id, "name": rankName, "division": divisionName}

def filename2map(filename: str):
    map_result = {}

    try:
        with open(MAP_JSON, "r") as f:
            maps = json.load(f)
    except Exception as e:
        raise BadFormatException(f"Unable to load maps data: {e}")
    
    for map in maps:
        if map['Map File Name'].lower() == filename.lower():
            map_result['id'] = map['Map Id']
            map_result['name'] = map['Map Base Name']
            map_result['variant'] = map['Map Variant Name']
            break
    
    if map_result['id'] == -1:
        logger.warning("Unable to find map for filename: %s.", filename)
    
    if map_result['name'] is None:
        logger.warning("Unable to find base name for filename: %s.", filename)
    
    if map_result['variant'] is None:
        logger.warning("Unable to find variant for filename: %s.", filename)

    return map_result

def debug2ranks(debug_info, playlist):
    translate = lambda playlist: next((value for key, value in SUPPORTED_PLAYLISTS.items() if key.lower() in playlist.lower()), None)
    playlist = translate(playlist)
    players = {}
    
    for item in debug_info:
        if "user" in item and "MMR" in item["user"]:
            [platform, uid, match_point] = item["user"].split('|')
            mmr = item["text"].split("|")[0]
            
            # e.g. MMR:Epic -> Epic
            clean = lambda unparsed: unparsed.split(":")[-1]
            
            if not uid in players:
                players[uid] = {}
                players[uid]["platform"] =clean(platform)
                
            players[uid][clean(match_point).lower()] = mmr

    
    if not players:
        logger.warning("Unable to find any players in debug info.")
        return None
    
    # fill missing info with None

    for uid in players:
        for match_point in ["pre", "post"]:
            if match_point not in players[uid]:
                players[uid][match_point] = None
    
    ranks = {}

    for uid in players:
        ranks[uid] = {
            "mmr": players[uid]["pre"],
            "rank": mmr2rank(float(players[uid]["pre"]), playlist) if players[uid]["pre"] else None,
    }
    
    return ranks

class ParsingResult:
    def __init__(self, result=None, error="") -> None:
        self.__result = result
        self.__error_message = self.__format__error_message(error)
        

    @property
    def error_message(self):
        return self.__error_message
    
    @property
    def result(self):
        return self.__result
    
    @error_message.setter
    def set_error_message(self, e):
        self.__error_message = self.__format__error_message(e)
    
    @result.setter
    def set_result(self, r):
        self.__result = r
    
    def __bool__(self):
        return True if not self.error_message and self.__result else False
    
    def __format__error_message(self, e):
        message = ""
        if isinstance(e, Exception):
            message = "".join(traceback.format_exception(type(e), e, e.__traceback__))
        return e if not message else message 
    
    def __str__(self) -> str:
        representation = {
            "result": self.result,
            "error": self.error_message
        }
        return f"ParsingResult<{hash(self)}>{representation}"

    def __repr__(self) -> str:
        representation = {
            "result": self.result,
            "error": self.error_message
        }
        return f"ParsingResult<{hash(self)}>{representation}"

def decompiled_replay_has_keys(d_replay, keys=[]):
     """
     Helpful to raise custom errors due to the format, and first level keys.
     """
     FORMAT_ERROR = "Bad Replay Format"

     def decorator(fun):
        def wrapper(*args, **kwargs):
            if not isinstance(d_replay, dict):
                raise Exception(f"{FORMAT_ERROR}: Decompiled Replay is not type 'dict' instead its type '{type(decompiled_replay)}'")
            
            for key in keys:
                if key not in d_replay:
                    raise Exception(f"{FORMAT_ERROR}: Decompiled replay doesn't have key: '{key}'.")
            
            return fun(*args, **kwargs)
        
        return wrapper
    
     return decorator

class RLGameMode:
    """
    RLGameMode is a helper class that look up what gamemode a replay is.

    Currently Beach Ball gamemode is not supported by boxcars.
    """
    # This match map can just be determined by gameinfo in the class_indices key, but there are special cases where you'd have to look in other places
    # Rocket Labs is not included because it's only the map that is different, and needs to check separetly with is_rocket_lab
    __GAMEMODE_MATCH_MAP = {
        'TAGame.GameInfo_Soccar_TA': 'Soccar',
        'TAGame.GameInfo_Basketball_TA': 'Hoops',
        'TAGame.GameInfo_Items_TA': 'Rumble',
        'TAGame.GameInfo_Breakout_TA': 'Dropshot',
        'TAGame.GameInfo_Hockey_TA': 'Snow Day',
        'TAGame.GameInfo_GodBall_TA': 'Heat Seeker',
        'TAGame.GameInfo_Football_TA': 'Gridiron',
        'TAGame.HauntedBallTrapTrigger_TA': 'Ghost Hunt',
        'TAGame.GameInfo_Season_TA': 'Season',
        'TAGame.GameInfo_Soccar_TA,TAGame.SpecialPickup_Rugby_TA,Anniversary': 'Spike Rush',
        'TAGame.GameInfo_Soccar_TA,Archetypes.Ball.CubeBall': 'Spooky Cube',
        'TAGame.GameInfo_Breakout_TA,TAGame.SpecialPickup_TA': 'Dropshot Rumble',
        'TAGame.GameInfo_Soccar_TA,Rocket Labs': 'Rocket Labs',
        'TAGame.GameInfo_Soccar_TA,Anniversary': 'Anniversary',   
    }

    @staticmethod 
    def __get_gamemode_based_off_map(decompiled_replay):
        REPLAY_MAP_NAME = decompiled_replay['properties']['MapName'].lower()

        if(re.match(r'^[l]abs.*', REPLAY_MAP_NAME)):
            return 'Rocket Labs'
        elif(re.match(r'throwbackstadium', REPLAY_MAP_NAME)):
            return 'Anniversary'
        
        return ""
        
    @staticmethod
    def get_gamemode(decompiled_replay) -> str:
        """
        Takes a decompiled replay, and determines it's gamemode
        """
        found_gamemode = ""
        
        class_indices = decompiled_replay['class_indices']
        objects = decompiled_replay['objects']

        for class_idx in class_indices:
            if class_idx['class'] in RLGameMode.__GAMEMODE_MATCH_MAP:
                found_gamemode += class_idx['class']
                break
        
        # additional checks for special cases: Spooky Cube and Dropshot Rumble
        if found_gamemode == 'TAGame.GameInfo_Breakout_TA':
            PICKUP_CLASS = 'TAGame.SpecialPickup_TA'
            for class_idx in class_indices:
                if PICKUP_CLASS in class_idx['class']:
                    found_gamemode += f",{PICKUP_CLASS}"
                    break
        elif found_gamemode == 'TAGame.SpecialPickup_Rugby_TA':
            return RLGameMode.__GAMEMODE_MATCH_MAP[found_gamemode]
        elif found_gamemode == 'TAGame.GameInfo_Soccar_TA':
            SPOOKY_OBJECT = 'Archetypes.Ball.CubeBall'
            RUGBY = 'TAGame.SpecialPickup_Rugby_TA'

            if SPOOKY_OBJECT in objects:
                found_gamemode += f",{SPOOKY_OBJECT}"
            else:
                for class_idx in reversed(class_indices):
                    if RUGBY in class_idx['class']:
                        found_gamemode += f',{RUGBY}'
                        break
        
        map_gamemode = RLGameMode.__get_gamemode_based_off_map(decompiled_replay)
        found_gamemode += f",{map_gamemode}" if map_gamemode else ""
        
        if found_gamemode in RLGameMode.__GAMEMODE_MATCH_MAP:
            return RLGameMode.__GAMEMODE_MATCH_MAP[found_gamemode]
        
        raise Exception(f'Unknown Game Mode Error. Is this a unsupported game mode? {found_gamemode}')