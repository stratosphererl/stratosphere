from config.database import Database
import http.client
import json

### GENERAL VARIABLES ###
replay_headers = {'cookie': "layer0_bucket=15; layer0_destination=default; layer0_environment_id_info=1680b086-a116-4dc7-a17d-9e6fdbb9f6d9", 'X-API-Key': "7fb73d50"}
user_headers = {'cookie': "layer0_bucket=15; layer0_destination=default; layer0_environment_id_info=1680b086-a116-4dc7-a17d-9e6fdbb9f6d9" }
replay_endpoint = "/replays.json"
user_endpoint = "/users?key=fa95aac0&limit=limit&platform=platform"

def fake_endpoint():
    mock_replays_file = open("mock_replays.json", "r")
    mock_replays_data = json.load(mock_replays_file)
    return mock_replays_data

### GENERAL METHODS ###
def update_stats_db():
    # replay_data = get_data(replay_headers, replay_endpoint) # Getting replay data from replaydb endpoint from replay service (TODO: unmock)
    # user_data = get_data(user_headers, user_endpoint) # Getting user data from userdb endpoint from user service (TODO: unmock)

    replay_data = fake_endpoint()

    updated_data = {
        "replays_by_arena": get_replay_arena_counts(replay_data),
        "replays_by_duration": get_replay_duration_counts(replay_data),
        "replays_by_rank": get_replay_rank_counts(replay_data),
        "replays_by_season": get_replay_season_counts(replay_data),
        # "user_platform_counts": get_user_platform_counts(user_data),
    }

    db = Database()
    db.set_all_zeros()
    db.update_tables(updated_data)

# Gets data from a particular endpoint /// TODO: un-mock the HTTPSConnection call, call instead our own services
def get_data(headers, endpoint):
    conn = http.client.HTTPSConnection("my.api.mockaroo.com")
    payload = ""
    conn.request("GET", endpoint, payload, headers)
    res = conn.getresponse()
    data_string = res.read().decode("utf-8")
    data = json.loads(data_string)
    return data

# Sum the count of instances which particular values appears in the data
def count_up_values(data, key):
    return_dict = {}

    for item in data:
        if item[key] not in return_dict.keys():
            return_dict[item[key]] = 1
        else:
            return_dict[item[key]] += 1

    return return_dict

# Counts the number of times a particular value appears in list, returns as dict
def convert_to_dict(data_list):
    return_dict = {}

    for value in data_list:
        if value not in return_dict.keys():
            return_dict[value] = 1
        else:
            return_dict[value] += 1

    return return_dict

### SPECIFIC METHODS ###

def get_replay_arena_counts(replay_data):
    return count_up_values(replay_data, "map")

def get_replay_duration_counts(replay_data):
    replay_duration_counts_list = []
    
    for replay in replay_data: # Append all replay durations (lengths) to replay_duration_counts
        replay_duration_counts_list.append(replay["length"])

    for index in range(len(replay_duration_counts_list)): # Rounding each duration down to the nearest multiple of 30 as int
        duration = replay_duration_counts_list[index]
        replay_duration_counts_list[index] = int(duration - (duration % 30))

    for index in range(len(replay_duration_counts_list)): # If any duration > 1200, set it equal to 1200
        if replay_duration_counts_list[index] > 1200:
            replay_duration_counts_list[index] = 1200

    return convert_to_dict(replay_duration_counts_list)

def get_replay_rank_counts(replay_data):
    return count_up_values(replay_data, "avgRank")

def get_replay_season_counts(replay_data):
    return count_up_values(replay_data, "season")

# Sum the count of users per platform, return as dict after calling convert_platform_names
def get_user_platform_counts(user_data):
    user_platform_counts = count_up_values(user_data, "platform")
    return convert_platform_names(user_platform_counts)

# Converts plaform names into their respective id num (Ex. "steam" --> 0, "epic" --> 1)
def convert_platform_names(user_platform_dict):
    return_dict = {}

    for key in user_platform_dict:
        if key == "steam":
            return_dict[0] = user_platform_dict[key]
        elif key == "epic":
            return_dict[1] = user_platform_dict[key]
    
    return return_dict

update_stats_db()