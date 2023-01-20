\connect parserdb

-- ALTER USER postgres PASSWORD 'test1'; -- variable name or value

-- RANKINGS
-- Ranking relation
CREATE TABLE ranking (
	num 				smallserial,
	name 				text,
	PRIMARY KEY (num));

-- Required ranking data
INSERT INTO ranking (num, name) VALUES
	(0,'Unranked'),
	(1,'Bronze I'),(2,'Bronze II'),(3,'Bronze III'),
	(4,'Silver I'),(5,'Silver II'),(6,'Silver III'),
	(7,'Gold I'),(8,'Gold II'),(9,'Gold III'),
	(10,'Platinum I'),(11,'Platinum II'),(12,'Platinum III'),
	(13,'Diamond I'),(14,'Diamond II'),(15,'Diamond III'),
	(16,'Champion I'),(17,'Champion II'),(18,'Champion III'),
	(19,'Grand Champion I'),(20,'Grand Champion II'),(21,'Grand Champion III'),
	(22,'Supersonic Legend'),
	(23,'Prospect I'),(24,'Prospect II'),(25,'Prospect III'),(26,'Prospect Elite'),
	(27,'Challenger I'),(28,'Challenger II'),(29,'Challenger III'),(30,'Challenger Elite'),
	(31,'Rising-Star'),(32,'All-Star'),(33,'Super-Star'),
	(34,'Champion'),(35,'Grand Champion'),(36,'Platinum');

-- Make it so num smallserial starts at 37, the next highest num value possible
ALTER SEQUENCE ranking_num_seq RESTART WITH 37;
	
-- PLATFORMS
-- Platform relation
CREATE TABLE platform (
	num					smallserial,
	name				text,
	PRIMARY KEY (num));
	
-- Required platform data
INSERT INTO platform (num, name) VALUES (-1, 'AI'), (0, 'STEAM'), (1, 'EPIC'), (2, 'PSN'), (3, 'XBOX'), (4, 'LAN');

-- Make it so num smallserial starts at 5, the next highest num value possible
ALTER SEQUENCE platform_num_seq RESTART WITH 5;
	
-- SEASONS
-- Season relation
CREATE TABLE season (
	num					smallserial,
	name				text,
	PRIMARY KEY (num));
	
-- Required season data
INSERT INTO season (num, name) VALUES
	(0,'Legacy 1'),(1,'Legacy 2'),(2,'Legacy 3'),(3,'Legacy 4'),
	(4,'Legacy 5'),(5,'Legacy 6'),(6,'Legacy 7'),(7,'Legacy 8'),
	(8,'Legacy 9'),(9,'Legacy 10'),(10,'Legacy 11'),(11,'Legacy 12'),
	(12,'Legacy 13'),(13,'Legacy 14'),(14,'Free-to-Play 1'),(15,'Free-to-Play 2'),
	(16,'Free-to-Play 3'),(17,'Free-to-Play 4'),(18,'Free-to-Play 5'),(19,'Free-to-Play 6'),
	(20,'Free-to-Play 7'),(21,'Free-to-Play 8'),(22,'Free-to-Play 9');

-- Make it so num smallserial starts at 22, the next highest num value possible
ALTER SEQUENCE season_num_seq RESTART WITH 22;
	
-- GAMEMODES
-- Gamemode relation
CREATE TABLE gamemode (
	num					smallserial,
	name				text,
	PRIMARY KEY (num));
-- Required gamemode data
INSERT INTO gamemode (num, name) VALUES
	(0,'Soccar'),(1,'Hoops'),(2,'Rumble'),(3,'Dropshot'),
	(4,'Snowday'),(5,'Rocket Labs'),(6,'Tournament'),(7,'Dropshot Rumble'),
	(8,'Heatseeker'),(9,'Gridiron'),(10,'Private'),(11,'Season'),
	(12,'Offline'),(13,'Local Lobby');

-- Make it so num smallserial starts at 14, the next highest num value possible
ALTER SEQUENCE gamemode_num_seq RESTART WITH 14;
	
-- GAMETYPES
-- Gametype relation
CREATE TABLE gametype (
	num					smallserial,
	name				text,
	PRIMARY KEY (num));
	
-- Required gametype data
INSERT INTO gametype (num, name) VALUES
	(0,'Duels (1v1)'),(1,'Doubles (2v2)'),(2,'Standard (3v3)'),(3,'Solo Standard (3v3)'),(4,'Chaos (4v4)');

-- Make it so num smallserial starts at 5, the next highest num value possible
ALTER SEQUENCE gametype_num_seq RESTART WITH 5;
	
-- TEAMS
-- Team relation
CREATE TABLE team (
	id					bigserial		not null,
	clubName			text,
	score				smallint	not null,
	PRIMARY KEY (id));

-- PLAYERS
-- Player relation
CREATE TABLE player (
	id					bigserial	not null,
	name				text		not null,
	team				bigserial	not null,
	platform			smallint	not null,
	ranking				smallint,
	mvp					boolean,
	pro					boolean,
	PRIMARY KEY (id),
	FOREIGN KEY (team) REFERENCES team(id) ON DELETE CASCADE,
	FOREIGN KEY (platform) REFERENCES platform(num),
	FOREIGN KEY (ranking) REFERENCES ranking(num));

-- ARENAS
-- Arena relation
CREATE TABLE arena (
	num					smallserial,
	name				text,
	PRIMARY KEY (num));

-- Required arena data
INSERT INTO arena (num, name) VALUES
	(0,'DFH Stadium'),(1,'DFH Stadium (Day)'), (2, 'DFH Stadium (Circuit)'), (3, 'DFH Stadium (Snowy)'), (4,'Mannfield'),
	(5,'Mannfield (Snowy)'),(6,'Mannfield (Night)'), (7,'Mannfield (Stormy)'),(8,'Mannfield (Snowy)'), (9,'Champions Field'),
	(10,'Champions Field (Day)'), (11,'Urban Central'),(12,'Urban Central (Dawn)'),(13,'Urban Central (Night)'),(14,'Beckwith Park'),
	(15,'Beckwith Park (Midnight)'),(16,'Beckwith Park (Stormy)'),(17,'Beckwith Park (Snowy)'),(18,'Utopia Coliseum'),
	(19,'Utopia Coliseum (Dusk)'),(20,'Utopia Coliseum (Snowy)'),(21,'Utopia Coliseum (Gilded)'),(22,'Wasteland'),(23,'Wasteland (Night)'),
	(24,'Neo Tokyo'),(25,'Neo Tokyo (Comic)'),(26,'AquaDome'),(27,'Starcase ARC'),(28,'Salty Shores'),(29,'Salty Shores (Night)'),
	(30,'Farmstead'),(31,'Farmstead (Night)'),(32,'Forbidden Temple'),(33,'Forbidden Temple (Day)'),(34,'Neon Field'), (35,'Deadeye Canyon'),
	(36,'Sovereign Heights'),(37,'Rivals Arena'),(38,'Badlands'),(39,'Badlands (Night)'),(40,'Tokyo Underpass'),(41,'ARCtagon'),
	(42,'Throwback Stadium'),(43,'Pillars'),(44,'Cosmic'),(45,'Double Goal'),(46,'Underpass'),(47,'Utopia Retro'),(48,'Octagon'),
	(49,'Forbidden Temple (Fire & Ice)');

-- Make it so num smallserial starts at 50, the next highest num value possible
ALTER SEQUENCE arena_num_seq RESTART WITH 50;

-- REPLAYS
-- Replay relation
CREATE TABLE replay (
	id					bigserial	not null,
	name				text		not null,
	uploader			text		not null,
	recorder			text		not null,
	uploadDate			text		not null,
	playingDate			text		not null,
	duration			int			not null,
	overtime			int,
	arena				int			not null,
	blueTeam			int			not null,
	orangeTeam			int			not null,
	season				int			not null,
	ranked				bool		not null,
	avgRank				int,
	gamemode			int			not null,
	gametype			int			not null,
	PRIMARY KEY (id),
	-- FOREIGN KEY (uploader) REFERENCES player(id),
	FOREIGN KEY (blueTeam) REFERENCES team(id),
	FOREIGN KEY (orangeTeam) REFERENCES team(id),
	FOREIGN KEY (arena) REFERENCES arena(num),
	FOREIGN KEY (season) REFERENCES season(num),
	FOREIGN KEY (avgRank) REFERENCES ranking(num),
	FOREIGN KEY (gamemode) REFERENCES gamemode(num),
	FOREIGN KEY (gametype) REFERENCES gametype(num));

-- '2021-12-12 02:21:27'

-- MOCK DATA: teams
INSERT INTO team (clubname, score) VALUES ('Orange', 3);
INSERT INTO team (clubname, score) VALUES ('Blue', 2);
INSERT INTO team (clubname, score) VALUES ('Orange', 0);
INSERT INTO team (clubname, score) VALUES ('Blue', 4);
INSERT INTO team (clubname, score) VALUES ('Stratosphere', 2);
INSERT INTO team (clubname, score) VALUES ('Federal Aerial Administration', 1);
INSERT INTO team (clubname, score) VALUES ('Naxos', 6);
INSERT INTO team (clubname, score) VALUES ('Guadalajara', 2);

-- MOCK DATA: players
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('PolskaReign', 1, 0, 0, true, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Lexy011111x', 2, 1, 0, false, false);

INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('_Gordon', 3, 1, 13, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('1i11ian', 3, 1, 14, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('kLean', 4, 2, 14, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('SenatorSanders', 4, 0, 14, true, false);

INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Oakerinos', 5, 0, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Novarchite', 5, 0, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Chicken935', 5, 1, 0, true, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Matth3w99', 6, 1, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('bullbyplays', 6, 1, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('RottingKing', 6, 1, 0, false, false);

INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('VEXhydrosis', 7, 1, 0, true, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('MyMotherLovesMe', 7, 1, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Armstrong', 7, -1, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Crayola', 8, 0, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('TSC_Owen', 8, 0, 0, false, true);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('TSC_Grenadier', 8, 0, 0, false, true);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Bandit', 8, -1, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Monchengladbach', 8, 0, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('Caveman', 8, -1, 0, false, false);
INSERT INTO player (name, team, platform, ranking, mvp, pro) VALUES ('andrettimaseratti', 8, 0, 0, false, false);

-- MOCK DATA: replays

INSERT INTO replay (name, uploader, recorder, uploaddate, playingdate, duration, overtime, arena, blueteam, orangeteam, season, ranked, avgrank, gamemode, gametype)
VALUES ('HNO19BQPB6210NWJFA93546LWPNX180M', 'PolskaReign', 'PolskaReign', '2023-01-14 02:21:27', '2023-01-14 02:14:32', 312, 0, 10, 2, 1, 22, false, 0, 0, 0);

INSERT INTO replay (name, uploader, recorder, uploaddate, playingdate, duration, overtime, arena, blueteam, orangeteam, season, ranked, avgrank, gamemode, gametype)
VALUES ('Solid Match', 'kLean', 'SenatorSanders', '2023-01-15 13:19:53', '2023-01-14 09:07:54', 309, 0, 4, 4, 3, 22, true, 14, 0, 1);

INSERT INTO replay (name, uploader, recorder, uploaddate, playingdate, duration, overtime, arena, blueteam, orangeteam, season, ranked, avgrank, gamemode, gametype)
VALUES ('Stratosphere vs FAA Dropshot', 'Matth3w99', 'Matth3w99', '2022-12-04 07:04:01', '2022-12-16 11:14:23', 405, 101, 13, 6, 5, 21, false, 0, 3, 2);

INSERT INTO replay (name, uploader, recorder, uploaddate, playingdate, duration, overtime, arena, blueteam, orangeteam, season, ranked, avgrank, gamemode, gametype)
VALUES ('Greece vs Mexico', 'JanBylock', 'TSC_Owen', '2022-06-03 11:08:41', '2022-06-04 13:13:01', 320, 0, 1, 8, 7, 19, false, 0, 0, 2);