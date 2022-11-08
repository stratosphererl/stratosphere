# Inserts

## Team relation

### Insert team data into team relation

```sql
-- Template
INSERT INTO team (clubname, score) VALUES ('<clubname>', <score>);

-- Example
INSERT INTO team (clubname, score) VALUES ('Federal Aerial Administration', 7);

INSERT INTO team (clubname, score) VALUES (null, 6);
```

## Player relation

### Insert player data into player relation

```sql
-- Template
INSERT INTO player VALUES ('<uniqueID>', '<playerUsername>', <teamNum>, <platformNum>, <playerRanking>, <mvpBool>, <proBool>);

-- Example
INSERT INTO player VALUES ('21928347342', 'Novarchite', 1, 0, 16, true, false);

INSERT INTO player VALUES ('82348098233', 'Chicken', 2, 1, 16, false, false);
```

## Replay relation

### Insert replay data into replay relation

```sql
-- Template
INSERT INTO replay (id, name, uploader, recorder, uploaddate, playingdate, duration, overtime, arena, blueteam, orangeteam, season, ranked, avgrank, gamemode, gametype)
VALUES ('<ballchasingReplayID>', '<storedReplayName>', '<uploaderUsername>', '<recorderUsername>', '<uploadDateText>', '<playingDateText>', <replayDurationSecondsInteger>, <overtimeDurationSecondsInteger>, '<arenaName>', <blueteamTeamID>, <orangeteamTeamID>, <seasonID>, <rankedBool>, <averagePlayerRank>, <gamemodeID>, <gametypeID>)

-- Example
INSERT INTO replay (id, name, uploader, recorder, uploaddate, playingdate, duration, overtime, arena, blueteam, orangeteam, season, ranked, avgrank, gamemode, gametype)
VALUES ('89831272', -- ballchasingReplayID
        'Hat Trick Assists', -- storedReplayName
        'Oakerinos', -- uploaderUsername
        'Chicken', -- recorderUsername
        '2022-04-17', -- uploadDateText
        '2022-04-15', -- playingDateText
        342,  -- replayDurationSecondsInteger
        0, -- overtimeDurationSecondsInteger
        'Mannfield', -- arenaName
        1, -- blueteamTeamID
        2, -- orangeteamTeamID
        20, -- seasonID
        true, -- rankedBool
        16, -- averagePlayerRank
        0, -- gamemodeID
        2); -- gametypeID
```

# Queries

## Ranking relation

### Get ranking num given ranking name
```sql
-- Template
SELECT num FROM ranking WHERE name = '<rankName>';

-- Example
SELECT num FROM ranking WHERE name = 'Silver3';
```

### Get ranking name given ranking num
```sql
-- Template
SELECT name FROM ranking WHERE num = <rankNum>

-- Example
SELECT name FROM ranking WHERE num = 6;
```

## Platform relation

### Get platform num given platform name
```sql
-- Template
SELECT num FROM platform WHERE name = '<platformName>'

-- Example
SELECT num FROM platform WHERE name = 'XBOX';
```

### Get platform name given platform num
```sql
-- Template
SELECT name FROM platform WHERE num = <platformNum>

-- Example
SELECT name FROM platform WHERE num = 3;
```

## Season relation

### Get season num given season name
```sql
-- Template
SELECT num FROM season WHERE name = '<seasonName>';

-- Example
SELECT num FROM season WHERE name = 'FS8';
```

### Get season name given season num
```sql
-- Template
SELECT name FROM season WHERE num = <seasonNum>;

-- Example
SELECT name FROM season WHERE num = 21;
```

## Gamemode relation

### Get gamemode num given gamemode name
```sql
-- Template
SELECT num FROM gamemode WHERE name = '<gamemodeName>';

-- Example
SELECT num FROM gamemode WHERE name = 'Snowday';
```

### Get gamemode name given gamemmode num
```sql
-- Template
SELECT name FROM gamemode WHERE num = <gamemodeNum>;

-- Example
SELECT name FROM gamemode WHERE num = 4;
```

## Gametype relation

### Get gametype num given gametype name
```sql
-- Template
SELECT num FROM gametype WHERE name = '<gametypeName>';

-- Example
SELECT num FROM gametype WHERE name = 'Standard';
```

### Get gametype name given gametype num
```sql
-- Template
SELECT name FROM gametype WHERE num = <gametypeNum>;

-- Example
SELECT name FROM gametype WHERE num = 2;
```

## Player relation

### Get player data given their player ID
```sql
-- Template
SELECT * FROM player WHERE id = '<playerID>';

-- Example
SELECT * FROM player WHERE id = '21928347342';
```

## Team relation

### Get team data given the team ID
```sql
-- Template
SELECT * FROM team WHERE id = <teamID>;

-- Example
SELECT * FROM team WHERE id = 1;
```

## Replay relation

### Get replay data given the replay ID
```sql
-- Template
SELECT * FROM replay WHERE id = '<replayID>';

-- Example
SELECT * FROM replay WHERE id = '89831272';
```

### Get all replay IDs with a particular uploader
```sql
-- Template
SELECT id FROM replay WHERE uploader = '<uploaderName>';

-- Example
SELECT id FROM replay WHERE uploader = 'Oakerinos';
```

### Get all replay IDs with a particular recorder
```sql
-- Template
SELECT id FROM replay WHERE recorder = '<recorderName>';

-- Example
SELECT id FROM replay WHERE recorder = 'Chicken';
```

### Get all replay IDs with a particular upload date
```sql
-- Template
SELECT id FROM replay WHERE uploaddate = '<uploadDate>';

-- Example
SELECT id FROM replay WHERE uploaddate = '2022-04-17';
```

### Get all replay IDs with a particular playing date
```sql
-- Template
SELECT id FROM replay WHERE playingdate = '<playingDate>';

-- Example
SELECT id FROM replay WHERE playingdate = '2022-04-15';
```

### Get all replay IDs with a particular duration value (<, <=, =, >=, >)
```sql
-- Template
SELECT id FROM replay WHERE duration <operator> <timeInSeconds>;

-- Example
SELECT id FROM replay WHERE duration > 300;
SELECT id FROM replay WHERE duration >= 100;
SELECT id FROM replay WHERE duration <= 100;
```

### Get all replay IDs with a particular overtime duration value (<, <=, =, >=, >)
```sql
-- Template
SELECT id FROM replay WHERE overtime <operator> <timeInSeconds>;

-- Example
SELECT id FROM replay WHERE overtime > 100;
SELECT id FROM replay WHERE overtime > 0; -- Gets all replays that went to overtime
```

### Get all replay IDs with a particular arena
```sql
-- Template
SELECT id FROM replay WHERE arena = '<arenaName>';

-- Example
SELECT id FROM replay WHERE arena = 'Mannfield';
SELECT id FROM replay WHERE arena = 'Deadeye Canyon';
```

### Get all replay IDs where x number of goals were scored, given operator (<, <=, =, >=, >)
```sql
-- Create a for loop which iterates through all unique replay ID values in the replay relation, the code below obtains all unique IDs
SELECT id FROM replay;

-- Then insert each replay ID in for <replayID> and store the replay ID of all queries which return a column of len 1, otherwise do not store that replay ID

-- Template
SELECT DISTINCT replay.id
FROM replay, team
WHERE (SELECT sum(score) FROM team WHERE team.id IN (
        (SELECT blueteam FROM replay WHERE id = '<replayID>'),
        (SELECT orangeteam FROM replay WHERE id = '<replayID>'))) <operator> <x>;

-- Example
SELECT DISTINCT replay.id
FROM replay, team
WHERE (SELECT sum(score) FROM team WHERE team.id IN (
        (SELECT blueteam FROM replay WHERE id = '89831272'),
        (SELECT orangeteam FROM replay WHERE id = '89831272'))) > 4;
```

### Get all replay IDs where one team scored x number of goals, given operator (<, <=, =, >=, >)
```sql
-- Create a for loop which iterates through all unique replay ID values in the replay relation, the code below obtains all unique IDs
SELECT id FROM replay;

-- Then insert each replay ID in for <replayID> and store the replay ID of all queries which return a column of len 1, otherwise do not store that replay ID

-- Template
SELECT DISTINCT replay.id
FROM replay, team
WHERE (SELECT score FROM team WHERE team.id IN (SELECT blueteam FROM replay WHERE id = '<replayID>')) <operator> <x>
        OR
      (SELECT score FROM team WHERE team.id IN (SELECT orangeteam FROM replay WHERE id = '<replayID>')) <operator> <x>;

-- Example
SELECT DISTINCT replay.id
FROM replay, team
WHERE (SELECT score FROM team WHERE team.id IN (SELECT blueteam FROM replay WHERE id = '89831272')) >= 7
        OR
      (SELECT score FROM team WHERE team.id IN (SELECT orangeteam FROM replay WHERE id = '89831272')) >= 7;

```

### Get all replay IDs from a particular season
```sql
-- Template
SELECT id FROM replay WHERE season = <seasonNum>;

-- Example
SELECT id FROM replay WHERE season = 20;
```

### Get all replay IDs with a particular average rank
```sql
-- Template
SELECT id FROM replay WHERE ranked = True AND avgrank = <rankNum>;

-- Example
SELECT id FROM replay WHERE ranked = True AND avgrank = 16;
```

### Get all replay IDs for a particular gamemode
```sql
-- Template
SELECT id FROM replay WHERE gamemode = <gamemodeNum>;

-- Example
SELECT id FROM replay WHERE gamemode = 0;
```

### Get all replay IDs for a particular gametype
```sql
-- Template
SELECT id FROM replay WHERE gametype = <gametypeNum>;

-- Example
SELECT id FROM replay WHERE gametype = 2;
```

### Append the WHERE statements from previous queries together to get more precise lists of replays
```sql
-- Possible template
SELECT id FROM replay WHERE season = <seasonNum> AND ranked = <rankedBool> AND gamemode = <gamemodeNum> AND gametype = <gametypeNum>;

-- Possible example (gets all replays from Free-to-Play season 7 that are ranked soccar standard (3v3) matches)
SELECT id FROM replay WHERE season = 20 AND ranked = True AND gamemode = 0 AND gametype = 2;
```

### Get the number of rows in the replay relation (that is, number of replays in the database)
```sql
-- Example
SELECT count(id) FROM replay;
```

## Updates

### Insert new ranking into ranking relation
```sql
-- Template
INSERT INTO ranking (name) VALUES ('<newRankName');

-- Example
INSERT INTO ranking (name) VALUES ('Hydrogen');
```

### Insert new platform into platform relation
```sql
-- Template
INSERT INTO platform (name) VALUES ('<platformNameUppercase>');

-- Example
INSERT INTO platform (name) VALUES ('FRIDGE');
```

### Insert new season into season relation
```sql
-- Template
INSERT INTO season (name) VALUES ('<seasonNameShorthand>');

-- Example
INSERT INTO season (name) VALUES ('FS21');
```

### Insert new gamemode into gamemode relation
```sql
-- Template
INSERT INTO gamemode (name) VALUES ('<gamemodeName>');

-- Example
INSERT INTO gamemode (name) VALUES ('HideAndSeek');
```

### Insert new gametype into game gametype relation
```sql
-- Template
INSERT INTO gametype (name) VALUES ('<gametypeName>');

-- Example
INSERT INTO gametype (name) VALUES ('Elevens');
```

## Deletes

### Delete replay using replay ID

```sql
-- Template
DELETE FROM replay WHERE id = '<replayID>';

-- Example
DELETE FROM replay WHERE id = '89831272';
```

### Delete all team and player data that were related to the deleted replay referenced via above code

```sql
-- Use the following to delete all team and player data related to replay deleted above

-- Use the following two statements and save their outputs as int variables BEFORE running the replay delete code
SELECT blueteam FROM replay WHERE '<replayID>'; -- Ex. var name blueteamint
SELECT orangeteam FROM replay WHERE '<replayID>'; -- Ex. var name orangeteamint

-- After calling the replay delete code, use the following to delete the replay's teams (players will be deleted via cascade)
DELETE FROM team WHERE id = <blueteamint>;
DELETE FROM team WHERE id = <orangeteamint>;
```