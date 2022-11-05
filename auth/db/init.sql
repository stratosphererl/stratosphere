DROP DATABASE authDB;

CREATE DATABASE authDB;
ALTER DATABASE authDB OWNER TO postgres;

\connect authdb

-- ALTER USER postgres PASSWORD 'test1'; -- variable name or value

-- PLATFORMS
-- Platform relation
CREATE TABLE platform (
	num					smallint		CHECK (num >= 0 AND num <= 1),
	name				text,
	PRIMARY KEY (num));

-- Required platform data
INSERT INTO platform (num, name) VALUES (0, 'STEAM'), (1, 'EPIC');

-- USERS
-- Users relation
CREATE TABLE users ( -- Table storing common variables across platforms: ID, which platform on, username
    id                  text            NOT NULL, -- Steam's "steamID" / Epic's "accountID"
    platform            int             NOT NULL, -- Int for platform, 0 == Steam, 1 == Epic
    username            text            NOT NULL, -- Steam's "player username" / Epic's "displayName"
	realName			text,					  -- Steam's "player's real name"
	profileUrl			text,					  -- Steam's "player's profile url"
	avatar				text,					  -- Steam's "an avatar"
	prefLang			text,					  -- Epic's "preferredLanguage"
    PRIMARY KEY (id, platform),
    FOREIGN KEY (platform) REFERENCES platform(num));