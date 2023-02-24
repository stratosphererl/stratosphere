UPDATE replays_by_rank SET count = 1 WHERE MOD(num,4) = 0; -- Set some values to 1
UPDATE replays_by_rank SET count = 2 WHERE MOD(num,4) = 1; -- ...
UPDATE replays_by_rank SET count = 3 WHERE MOD(num,4) = 2;
UPDATE replays_by_rank SET count = 4 WHERE MOD(num,4) = 3;