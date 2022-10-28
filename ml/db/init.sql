-- INITALIZATION

DROP DATABASE stratosphere;

CREATE DATABASE stratosphere;
ALTER DATABASE stratosphere OWNER TO postgres;

\connect stratosphere

ALTER USER postgres PASSWORD 'test1';

-- RANKINGS

-- Ranking relation
CREATE TABLE ranking (
	num 				int 		CHECK (num >= 0 AND num <= 36),
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
	num					int			CHECK (num >= 0 AND num <= 3),
	name				text,
	PRIMARY KEY (num));
	
-- Required platform data
INSERT INTO platform (num, name) VALUES (0, 'STEAM'), (1, 'EPIC'), (2, 'PSN'), (3, 'XBOX');
	
-- SEASONS
	
-- Season relation
CREATE TABLE season (
	num					int			CHECK (num >= 0 AND num <= 22),
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
	num					int			CHECK (num >= 0 AND num <= 13),
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
	num					int			CHECK (num >= 0 AND num <= 4),
	name				text,
	PRIMARY KEY (num));
	
-- Required gametype data
INSERT INTO gametype (num, name) VALUES
	(0,'Duels'),(1,'Doubles'),(2,'Standard'),(3,'SoloStandard'),(4,'Chaos');
	
-- PLAYERS

-- Player relation
CREATE TABLE player (
	id					serial		not null,
	name				text		not null,
	platform			smallint	not null,
	ranking				smallint,
	isPro				boolean,
	PRIMARY KEY (id),
	FOREIGN KEY (platform) REFERENCES platform(num),
	FOREIGN KEY (ranking) REFERENCES ranking(num));
	
-- Example player data inserts
-- INSERT INTO player (name, platform, ranking, isPro) VALUES ('Novarchite', 0, 16, false);
-- INSERT INTO player (name, platform, ranking, isPro) VALUES (<username>, <platformNum>, <rankingNum>, <proBoolean>);
	
-- TEAMS
	
-- Team relation
CREATE TABLE team (
	id					serial		not null,
	clubName			text,
	score				smallint	not null,
	PRIMARY KEY (id));
	
-- Example team data inserts
-- INSERT INTO team (name, score) VALUES ('Federal Aerial Administration', 3), ('Stratosphere', 2);
-- INSERT INTO team (name, score) VALUES (<teamName>, <goalsScored>);
-- INSERT INTO team (score) VALUES (4);
-- INSERT INTO team (score) values (<goalsScored>);

-- REPLAYS

-- Replay relation
CREATE TABLE replay (
	id					text		not null,
	name				text		not null,
	uploader			int			not null,
	uploadDate			bigint		not null		CHECK (uploadDate >= 0 AND uploadDate <= 2147483647),
	playingDate			bigint		not null		CHECK (playingDate >= 0 AND playingDate <= 2147483647),
	duration			bigint		not null		CHECK (duration >= 0 AND duration <= 2147483647),
	overtime			bigint						CHECK (overtime >= 0 AND overtime <= 2147483647),
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

-- Example replay data inserts
-- INSERT INTO replay (name, uploader, uploadDate, playingDate, duration, overtime, arena, blueTeam, orangeTeam, season, ranked, gamemode, gametype) VALUES
--		('BEST SHOT EVER!!!', 'Novarchite', 1639900000, 1639800000, 321, null, 'Mannfield', 28, 29, 4, false, 0, 2);
-- INSERT INTO replay (name, uploader, uploadDate, playingDate, duration, overtime, arena, blueTeam, orangeTeam, season, ranked, ranking, gamemode, gametype) VALUES
--		('BEST SHOT EVER!!!', 'Novarchite', 1639900000, 1639800000, 321, null, 'Mannfield', 28, 29, 4, false, 1, 0, 2);

-- TEAMS HAVE PLAYERS

-- hasPlayers relation
CREATE TABLE hasPlayers (
	teamID				int			not null,
	playerID			int			not null,
	PRIMARY KEY (teamID, playerID),
	FOREIGN KEY (teamID) REFERENCES team(id),
	FOREIGN KEY (playerID) REFERENCES player(id));
	
-- Example hasPlayers data inserts
-- INSERT INTO hasPlayers (teamID, playerID) VALUES (320, 1021);

-- '2021-12-12 02:21:27'