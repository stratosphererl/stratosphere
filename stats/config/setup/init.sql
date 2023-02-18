-- May want to create SQL scalar function to create tables in less code
-- https://www.ibm.com/docs/en/db2/11.5?topic=functions-creating-sql-scalar

-- RELATIONS FOR REPLAYS
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