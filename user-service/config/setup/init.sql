CREATE TYPE game_platform AS ENUM ('steam', 'epic');

CREATE TABLE users (
    -- Basic Info
    id              int             NOT NULL,
    platform        game_platform   NOT NULL,
    username        text            NOT NULL,
    date_created    text,

    -- Stats
    number_of_replays int,
    wins int,
    losses int,
    total_goals int,
    total_assists int,
    total_saves int,
    total_shots int,

    PRIMARY KEY(id)
);