-- CREATE DATABASE statsdb;
-- ALTER DATABASE statsdb OWNER TO postgres;
-- \connect statsdb

CREATE TABLE rank (
	num 	smallserial,
	name 	text,
    count   int,
	PRIMARY KEY (num));

-- Required ranking data
INSERT INTO rank (num, name, count) VALUES
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

CREATE TABLE platform (
    num     smallserial,
    name    text,
    count   int,
    PRIMARY KEY (num));

INSERT INTO platform (num, name, count) VALUES
    (0,'STEAM',0),
    (1,'EPIC',0);