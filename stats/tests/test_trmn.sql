UPDATE replays_by_rank SET count = 0 WHERE num >= 0; -- Resets all count values in replays_by_rank
UPDATE replays_by_arena SET count = 0 WHERE num >= 0; -- ...
UPDATE replays_by_duration SET count = 0 WHERE duration >= 0;
UPDATE replays_by_season SET count = 0 WHERE num >= 0;
UPDATE users_by_platform SET count = 0 WHERE num >= 0;
UPDATE users_by_rank SET count = 0 WHERE num >= 0;