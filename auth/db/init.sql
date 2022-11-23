DROP DATABASE authDB;

CREATE DATABASE authDB;
ALTER DATABASE authDB OWNER TO postgres;

\connect authdb

-- ALTER USER postgres PASSWORD 'test1'; -- variable name or value

-- PLATFORMS
-- Platform relation
CREATE TABLE platform (
	num					smallserial,
	name				text,
	PRIMARY KEY (num));

-- Required platform data
INSERT INTO platform (num, name) VALUES (0, 'STEAM'), (1, 'EPIC');

-- Make it so num smallserial starts at 2, the next highest num value possible
ALTER SEQUENCE platform_num_seq RESTART WITH 2;

-- USERS
-- Users relation
CREATE TABLE users ( -- Table storing variables provided by all platforms
    id                  text            NOT NULL, -- Steam's "steamID" / Epic's "accountID"
    platform            int             NOT NULL, -- Int for platform, 0 == Steam, 1 == Epic
    username            text            NOT NULL, -- Steam's "player username" / Epic's "displayName"
	realName			text,					  -- Steam's "player's real name"
	profileUrl			text,					  -- Steam's "player's profile url"
	avatar				text,					  -- Steam's "an avatar"
	prefLang			text,					  -- Epic's "preferredLanguage"
    PRIMARY KEY (id, platform),
    FOREIGN KEY (platform) REFERENCES platform(num));