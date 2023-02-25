UPDATE replays_by_rank SET count = 1 WHERE MOD(num,4) = 0; -- Set some values to 1
UPDATE replays_by_rank SET count = 2 WHERE MOD(num,4) = 1; -- ...
UPDATE replays_by_rank SET count = 3 WHERE MOD(num,4) = 2;
UPDATE replays_by_rank SET count = 4 WHERE MOD(num,4) = 3;

UPDATE replays_by_arena SET count = 7 WHERE num = 3; -- Set arena with num = 3 to count = 7
UPDATE replays_by_arena SET count = 41 WHERE num = 27; -- ...

UPDATE replays_by_duration SET count = 12 WHERE duration = 0; -- Set row with duration = 0 (meaning 0-59s) to 12
UPDATE replays_by_duration SET count = 7 WHERE duration = 30; -- ...
UPDATE replays_by_duration SET count = 12 WHERE duration = 330;
UPDATE replays_by_duration SET count = 2 WHERE duration = 360;
UPDATE replays_by_duration SET count = 4 WHERE duration = 1200;

UPDATE replays_by_season SET count = 7 WHERE num = 0; -- Set season with num = 0 to count = 7
UPDATE replays_by_season SET count = 4 WHERE num = 1; -- ...
UPDATE replays_by_season SET count = 1 WHERE num = 12;
UPDATE replays_by_season SET count = 6 WHERE num = 15;
UPDATE replays_by_season SET count = 3 WHERE num = 20;
UPDATE replays_by_season SET count = 1 WHERE num = 21;

UPDATE users_by_platform SET count = 41 WHERE num = 0; -- Set platform with num = 0 to count = 41
UPDATE users_by_platform SET count = 33 WHERE num = 1; -- ...

UPDATE users_by_rank SET count = 8 WHERE num = 0; -- Set rank with num = 0 to count = 8
UPDATE users_by_rank SET count = 2 WHERE num = 1; -- ...
UPDATE users_by_rank SET count = 13 WHERE num = 11;
UPDATE users_by_rank SET count = 6 WHERE num = 14;
UPDATE users_by_rank SET count = 2 WHERE num = 21;
UPDATE users_by_rank SET count = 17 WHERE num = 22;