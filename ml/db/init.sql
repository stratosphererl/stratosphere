-- INITALIZATION

DROP DATABASE scraperDB;

CREATE DATABASE scraperDB;
ALTER DATABASE scraperDB OWNER TO postgres;

\connect scraperDB

-- ALTER USER postgres PASSWORD 'test1'; -- variable name or value

-- RANKINGS
-- Ranking relation
CREATE TABLE ranking (
	num 				smallint 	CHECK (num >= 0 AND num <= 36),
	name 				text,
	PRIMARY KEY (num));
	
-- Required ranking data
INSERT INTO ranking (num, name) VALUES
	(0,'Unranked'),
	(1,'Bronze1'),(2,'Bronze2'),(3,'Bronze3'),
	(4,'Silver1'),(5,'Silver2'),(6,'Silver3'),
	(7,'Gold1'),(8,'Gold2'),(9,'Gold3'),
	(10,'Platinum1'),(11,'Platinum2'),(12,'Platinum3'),
	(13,'Diamond1'),(14,'Diamond2'),(15,'Diamond3'),
	(16,'Champion1'),(17,'Champion2'),(18,'Champion3'),
	(19,'GrandChamp1'),(20,'GrandChamp2'),(21,'GrandChamp3'),
	(22,'SupersonicLegend'),
	(23,'Prospect1'),(24,'Prospect2'),(25,'Prospect3'),(26,'ProspectElite'),
	(27,'Challenger1'),(28,'Challenger2'),(29,'Challenger3'),(30,'ChallengerElite'),
	(31,'RisingStar'),(32,'AllStar'),(33,'SuperStar'),
	(34,'Champion'),(35,'GrandChampion'),(36,'Platinum');
	
-- PLATFORMS
-- Platform relation
CREATE TABLE platform (
	num					smallint		CHECK (num >= 0 AND num <= 4),
	name				text,
	PRIMARY KEY (num));
	
-- Required platform data
INSERT INTO platform (num, name) VALUES (0, 'STEAM'), (1, 'EPIC'), (2, 'PSN'), (3, 'XBOX'), (4, 'LAN');
	
-- SEASONS
-- Season relation
CREATE TABLE season (
	num					smallint		CHECK (num >= 0 AND num <= 21),
	name				text,
	PRIMARY KEY (num));
	
-- Required season data
INSERT INTO season (num, name) VALUES
	(0,'LS1'),(1,'LS2'),(2,'LS3'),(3,'LS4'),
	(4,'LS5'),(5,'LS6'),(6,'LS7'),(7,'LS8'),
	(8,'LS9'),(9,'LS10'),(10,'LS11'),(11,'LS12'),
	(12,'LS13'),(13,'LS14'),(14,'FS1'),(15,'FS2'),
	(16,'FS3'),(17,'FS4'),(18,'FS5'),(19,'FS6'),
	(20,'FS7'),(21,'FS8');
	
-- GAMEMODES
-- Gamemode relation
CREATE TABLE gamemode (
	num					smallint		CHECK (num >= 0 AND num <= 13),
	name				text,
	PRIMARY KEY (num));
-- Required gamemode data
INSERT INTO gamemode (num, name) VALUES
	(0,'Soccar'),(1,'Hoops'),(2,'Rumble'),(3,'Dropshot'),
	(4,'Snowday'),(5,'RocketLabs'),(6,'Tournament'),(7,'DropshotRumble'),
	(8,'Heatseeker'),(9,'Gridiron'),(10,'Private'),(11,'Season'),
	(12,'Offline'),(13,'LocalLobby');
	
-- GAMETYPES
-- Gametype relation
CREATE TABLE gametype (
	num					smallint		CHECK (num >= 0 AND num <= 4),
	name				text,
	PRIMARY KEY (num));
	
-- Required gametype data
INSERT INTO gametype (num, name) VALUES
	(0,'Duels'),(1,'Doubles'),(2,'Standard'),(3,'SoloStandard'),(4,'Chaos');
	
-- PLAYERS
-- Player relation
CREATE TABLE player (
	id					text		not null,
	name				text		not null,
	platform			smallint	not null,
	ranking				smallint,
	mvp					boolean,
	pro					boolean,
	PRIMARY KEY (id),
	FOREIGN KEY (platform) REFERENCES platform(num),
	FOREIGN KEY (ranking) REFERENCES ranking(num));
	
-- TEAMS
-- Team relation
CREATE TABLE team (
	id					serial		not null,
	clubName			text,
	score				smallint	not null,
	PRIMARY KEY (id));

-- REPLAYS
-- Replay relation
CREATE TABLE replay (
	id					text		not null,
	name				text		not null,
	uploader			int			not null,
	uploadDate			text		not null,
	playingDate			text		not null,
	duration			int			not null,
	overtime			int,
	arena				text		not null,
	blueTeam			int			not null,
	orangeTeam			int			not null,
	season				int			not null,
	ranked				bool		not null,
	avgRank				int,
	gamemode			int			not null,
	gametype			int			not null,
	PRIMARY KEY (id),
	FOREIGN KEY (uploader) REFERENCES player(id),
	FOREIGN KEY (blueTeam) REFERENCES team(id),
	FOREIGN KEY (orangeTeam) REFERENCES team(id),
	FOREIGN KEY (season) REFERENCES season(num),
	FOREIGN KEY (avgRank) REFERENCES ranking(num),
	FOREIGN KEY (gamemode) REFERENCES gamemode(num),
	FOREIGN KEY (gametype) REFERENCES gametype(num));

-- TEAMS HAVE PLAYERS
-- hasPlayers relation
CREATE TABLE hasPlayers (
	teamID				int			not null,
	playerID			int			not null,
	PRIMARY KEY (teamID, playerID),
	FOREIGN KEY (teamID) REFERENCES team(id),
	FOREIGN KEY (playerID) REFERENCES player(id));

-- '2021-12-12 02:21:27'