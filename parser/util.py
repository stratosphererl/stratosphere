import psycopg

def getTeamInfo(returnData, num, cur):
    teamInfo = {}
    
    # Getting team name
    cur.execute("SELECT clubname FROM team WHERE id = %(int)s;", {'int': returnData[-1][num]})
    clubname = cur.fetchone()[0]
    teamInfo["name"] = clubname
    
    # Getting team score
    cur.execute("SELECT score FROM team WHERE id = %(int)s;", {'int': returnData[-1][num]})
    score = cur.fetchone()[0]
    teamInfo["score"] = score
    
    # Getting team player usernames
    cur.execute("SELECT name FROM player WHERE team = %(int)s;", {'int': returnData[-1][num]})
    usernames = cur.fetchall()
    playerList = []
    for username in usernames:
        playerList.append(username[0])
    teamInfo["players"] = playerList
    
    return teamInfo

def convertToDict(replayData):
    newData = {}
    
    newData["title"] = replayData[1] # replay name
    newData["uploader"] = replayData[2] # user who uploaded replay
    newData["recorder"] = replayData[3] # user who recorded (saved) replay
    newData["uploaded"] = replayData[4] # datetime when replay was uploaded
    newData["played"] = replayData[5] # datetime when replay was played / recorded
    newData["duration"] = replayData[6] # duration of replay in mm:ss
    newData["overtime"] = replayData[7] # boolean of whether replay has overtime
    newData["arena"] = replayData[8] # field/arena of the replay
    newData["blue"] = replayData[9] # clubname and players for "blue" team
    newData["orange"] = replayData[10] # clubname and players for "orange" team
    newData["season"] = replayData[11] # current season when replay was recorded
    newData["ranked"] = replayData[12] # boolean of whether the replay is a ranked match
    newData["rank"] = replayData[13] # avg rank of the replay, "Unranked" if casual
    newData["gamemode"] = replayData[14] # gamemode of the replay (ex. "Soccar")
    newData["gametype"] = replayData[15] # gametype of the replay (ex. "Doubles")
    
    return newData

def convertToMinSec(duration):
    if duration % 60 > 10: # If seconds value > 10
        return str(int(duration / 60)) + ":" + str(duration % 60)
    else: # If seconds value < 10 (ex. 9, we want mm:09, not mm:9)
        return str(int(duration / 60)) + ":0" + str(duration % 60)