-- May want to create SQL scalar function to create tables in less code
-- https://www.ibm.com/docs/en/db2/11.5?topic=functions-creating-sql-scalar

-- RELATIONS FOR REPLAYS
-- replays_by_arena
CREATE TABLE replays_by_arena (
    num     smallserial,
    name    text,
    count   int,
    PRIMARY KEY (num));

INSERT INTO replays_by_arena (num, name, count) VALUES
	(0, 'DFH Stadium', 0), (1, 'DFH Stadium (Day)', 0), (2, 'DFH Stadium (Stormy)', 0), (3, 'DFH Stadium (Circuit)', 0), (4, 'DFH Stadium (Snowy)', 0),
	(5, 'Mannfield', 0), (6, 'Mannfield (Night)', 0), (7, 'Mannfield (Stormy)', 0), (8, 'Mannfield (Snowy)', 0),
	(9, 'Champions Field', 0), (10, 'Champions Field (Day)', 0),
	(11, 'Urban Central', 0), (12, 'Urban Central (Dawn)', 0), (13, 'Urban Central (Night)', 0),
	(14, 'Beckwith Park', 0), (15, 'Beckwith Park (Midnight)', 0), (16, 'Beckwith Park (Stormy)', 0), (17, 'Beckwith Park (Snowy)', 0),
	(18, 'Utopia Coliseum', 0), (19, 'Utopia Coliseum (Dusk)', 0), (20, 'Utopia Coliseum (Gilded)', 0), (21, 'Utopia Coliseum (Snowy)', 0),
	(22, 'Beckwith Park', 0), (23, 'Beckwith Park (Midnight)', 0), (24, 'Beckwith Park (Stormy)', 0), (25, 'Beckwith Park (Snowy)', 0),
	(26, 'Wasteland', 0), (27, 'Wasteland (Night)', 0), (28, 'Neo Tokyo', 0), (29, 'Neo Tokyo (Comic)', 0), (30, 'AquaDome', 0),
	(31, 'Starbase Arc', 0), (32, 'Starbase Arc (Aftermath)', 0), (33, 'Salty Shores', 0), (34, 'Salty Shores (Night)', 0), (35, 'Farmstead', 0),
	(36, 'Farmstead (Night)', 0), (37, 'Forbidden Temple', 0), (38, 'Forbidden Temple (Day)', 0), (39, 'Forbidden Temple (Fire & Ice)', 0),
	(40, 'Neon Fields', 0), (41, 'Deadeye Canyon', 0), (42, 'Sovereign Heights', 0), (43, 'Rivals Arena', 0), (44, 'Badlands', 0), (45, 'Badlands (Night)', 0),
	(46, 'Tokyo Underpass', 0), (47, 'ARCtagon', 0), (48, 'Throwback Stadium', 0), (49, 'Pillars', 0), (50, 'Cosmic', 0), (51, 'Double Goal', 0),
	(52, 'Underpass', 0), (53, 'Utopia Retro', 0), (54, 'Octagon', 0), (55, 'Dunk House', 0), (56, 'The Block', 0), (57, 'Core 707', 0);

-- replays_by_duration
CREATE TABLE replays_by_duration (
    duration    int,
    count       int,
    PRIMARY KEY (duration));

INSERT INTO replays_by_duration (duration, count) VALUES
    (0,0), -- count of replays with duration of 0 to 29 seconds
    (30,0), -- count of replays with duration of 30 to 59 seconds
    (60,0), -- etc.
    (90,0), (120,0), (150,0), (180,0), (210,0), (240,0), (270,0), (300,0), (330,0), (360,0), (390,0), (420,0), (450,0), (480,0), (510,0),
    (540,0), (570,0), (600,0), (630,0), (660,0), (690,0), (720,0), (750,0), (780,0), (810,0), (840,0), (870,0), (900,0), (930,0), (960,0),
    (990,0), (1020,0), (1050,0), (1080,0), (1110,0), (1140,0), (1170,0), (1200,0);


-- replays_by_rank
CREATE TABLE replays_by_rank (
    num 	smallserial,
	name 	text,
    count   int,
	PRIMARY KEY (num));

INSERT INTO replays_by_rank (num, name, count) VALUES
	(0,'Unranked',0),
	(1,'Bronze1',0),
    (2,'Bronze2',0),
    (3,'Bronze3',0),
	(4,'Silver1',0),
    (5,'Silver2',0),
    (6,'Silver3',0),
	(7,'Gold1',0),
    (8,'Gold2',0),
    (9,'Gold3',0),
	(10,'Platinum1',0),
    (11,'Platinum2',0),
    (12,'Platinum3',0),
	(13,'Diamond1',0),
    (14,'Diamond2',0),
    (15,'Diamond3',0),
	(16,'Champion1',0),
    (17,'Champion2',0),
    (18,'Champion3',0),
	(19,'GrandChamp1',0),
    (20,'GrandChamp2',0),
    (21,'GrandChamp3',0),
	(22,'SupersonicLegend',0);

-- replays_by_season
CREATE TABLE replays_by_season (
    num     smallserial,
    name    text,
    count   int,
    PRIMARY KEY (num));

INSERT INTO replays_by_season (num, name, count) VALUES
    (0,'LS1',0),
    (1,'LS2',0),
    (2,'LS3',0),
    (3,'LS4',0),
	(4,'LS5',0),
    (5,'LS6',0),
    (6,'LS7',0),
    (7,'LS8',0),
	(8,'LS9',0),
    (9,'LS10',0),
    (10,'LS11',0),
    (11,'LS12',0),
	(12,'LS13',0),
    (13,'LS14',0),
    (14,'FS1',0),
    (15,'FS2',0),
	(16,'FS3',0),
    (17,'FS4',0),
    (18,'FS5',0),
    (19,'FS6',0),
	(20,'FS7',0),
    (21,'FS8',0);

-- RELATIONS FOR USERS
-- users_by_platform
CREATE TABLE users_by_platform (
    num     smallserial,
    name    text,
    count   int,
    PRIMARY KEY (num));

INSERT INTO users_by_platform (num, name, count) VALUES
    (0,'STEAM',0),
    (1,'EPIC',0);

-- users_by_rank
CREATE TABLE users_by_rank (
    num     smallserial,
    name    text,
    count   int,
    PRIMARY KEY (num));

INSERT INTO users_by_rank (num, name, count) VALUES
	(0,'Unranked',0),
	(1,'Bronze1',0),
    (2,'Bronze2',0),
    (3,'Bronze3',0),
	(4,'Silver1',0),
    (5,'Silver2',0),
    (6,'Silver3',0),
	(7,'Gold1',0),
    (8,'Gold2',0),
    (9,'Gold3',0),
	(10,'Platinum1',0),
    (11,'Platinum2',0),
    (12,'Platinum3',0),
	(13,'Diamond1',0),
    (14,'Diamond2',0),
    (15,'Diamond3',0),
	(16,'Champion1',0),
    (17,'Champion2',0),
    (18,'Champion3',0),
	(19,'GrandChamp1',0),
    (20,'GrandChamp2',0),
    (21,'GrandChamp3',0),
	(22,'SupersonicLegend',0);