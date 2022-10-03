-- <id> is the value for the "id" column of the desired replay
-- returns a max 120 length varchar

SELECT filename
FROM replay
WHERE id = <id>;