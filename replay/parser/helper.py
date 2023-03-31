import json
import datetime 
import logging
import os

__name__ = "parser.helper"

logger = logging.getLogger(__name__)
handler = logging.StreamHandler()

formatter = logging.Formatter('LOG: %(name)s[%(levelname)s] @ %(asctime)s: %(message)s')

logger.setLevel(logging.WARNING)
handler.setFormatter(formatter)
logger.addHandler(handler)

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
    "snowday": "Snowday",
    "tournament": "Tournament",
}

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

    return {"name": seasonName, "id": id}


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
    playlist : Playlist
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

    try:
        with open(RANK_JSON, "r") as f:
            ranks = json.load(f)
    except Exception as e:
        raise BadFormatException(f"Unable to load ranks data: {e}")
    
    if not playlist in ranks:
        raise BadFormatException(f"Unable to find supported playlist {playlist} in rank data. Supported playlists: {', '.join(ranks.keys())}")
    
    for rank_id in ranks[playlist]:
        previous_rank = None
        previous_rank_id = None
        if rank_id != '1':
            previous_rank_id = f"{int(rank_id) - 1}"
            previous_rank = ranks[playlist][previous_rank_id]
        rank = ranks[playlist][rank_id]

        if "divisions" not in rank:
            raise BadFormatException(f"Unable to find divisions in rank data for playlist {playlist} and rank {rank_id}")
        
        divisions = rank["divisions"]

        for division_id in divisions.keys():
            division = divisions[division_id]
            
            if "start" not in division or "end" not in division:
                raise BadFormatException(f"Unable to find start or end in division data for playlist {playlist}, rank {rank_id} and division {division_id}")

    
            # Special case, there is no end range for the highest rank
            if rank['name'] == "Supersonic Legend" and mmr >= divisions[division_id]["start"]:
                divisionName = division["name"]
                rankName = rank['name']
                id = int(rank_id)
        
            elif divisions[division_id]["start"] <= mmr <= divisions[division_id]["end"]:

                if "name" not in rank or "name" not in division:
                    raise BadFormatException(f"Unable to find name in rank or division data for playlist {playlist}, rank {rank_id} and division {division_id}")

                rankName = rank['name']
                divisionName = division["name"]
                id = int(rank_id)
                break
            # if it doesn't fall nicely into a division bracket, make them a part of the previous rank's last seen division
            elif previous_rank != None and divisions[division_id]["start"] >= mmr >= previous_rank['divisions'][division_id]['end']:
                rankName = previous_rank['name']
                divisionName = previous_rank['divisions'][division_id]["name"]
                id = int(previous_rank_id)
                break
    
    return {"id": id, "name": rankName, "division": divisionName}

def filename2map(filename: str):
    map_result = {"id": -1, "base_name": None, "variant": None}

    try:
        with open(MAP_JSON, "r") as f:
            maps = json.load(f)
    except Exception as e:
        raise BadFormatException(f"Unable to load maps data: {e}")
    
    for map in maps:
        if map['Map File Name'] == filename:
            map_result["id"] = map['Map Id']
            map_result["base_name"] = map['Map Base Name']
            map_result["variant"] = map['Map Variant Name']
            break
    
    if map_result["id"] == -1:
        logger.warning("Unable to find map for filename: %s.", filename)
    
    if map_result["base_name"] is None:
        logger.warning("Unable to find base name for filename: %s.", filename)
    
    if map_result["variant"] is None:
        logger.warning("Unable to find variant for filename: %s.", filename)

    return map_result

def debug2mmr(debug_info, playlist):
    translate = lambda playlist: next((value for key, value in SUPPORTED_PLAYLISTS.items() if key in playlist.lower()), None)
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
    
    return [
        {
            "id": uid,
            "platform": players[uid]["platform"],
            "pre_mmr": players[uid]["pre"],
            "post_mmr": players[uid]["post"],
            "post_rank": mmr2rank(float(players[uid]["post"]), playlist) if players[uid]["post"] else None,
            "pre_rank": mmr2rank(float(players[uid]["pre"]), playlist) if players[uid]["pre"] else None
        }

        for uid in players
    ]