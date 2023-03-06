from config.database import Database
import http.client
import json

replay_headers = {'cookie': "layer0_bucket=15; layer0_destination=default; layer0_environment_id_info=1680b086-a116-4dc7-a17d-9e6fdbb9f6d9", 'X-API-Key': "7fb73d50"}
user_headers = {'cookie': "layer0_bucket=15; layer0_destination=default; layer0_environment_id_info=1680b086-a116-4dc7-a17d-9e6fdbb9f6d9" }
replay_endpoint = "/replays.json"
user_endpoint = "/users?key=fa95aac0&limit=limit&platform=platform"

def update_stats_db():
    replay_data = get_data(replay_headers, replay_endpoint) # Getting replay data from replaydb endpoint from replay service (TODO: unmock)
    user_data = get_data(user_headers, user_endpoint) # Getting user data from userdb endpoint from user service (TODO: unmock)

    platform_counts = {"steam": 0, "epic": 0}

    for user in user_data: # Add one for each instance of a user from each platform
        platform_counts[user["platform"]] += 1
        print(platform_counts[user["platform"]])

    db = Database()
    db.set_all_zeros()
    
    for platform in platform_counts:
        if platform == "steam":
            db.update_value("users_by_platform", 0, platform_counts[platform])
            print(platform_counts[platform])
        elif platform == "epic":
            db.update_value("users_by_platform", 1, platform_counts[platform])
            print(platform_counts[platform])

def get_data(headers, endpoint):
    conn = http.client.HTTPSConnection("my.api.mockaroo.com")
    payload = ""
    conn.request("GET", endpoint, payload, headers)
    res = conn.getresponse()
    data_string = res.read().decode("utf-8")
    data = json.loads(data_string)
    return data

update_stats_db()