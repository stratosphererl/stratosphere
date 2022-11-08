## Inserts

### Insert new platform to platform relation
```sql
-- Template
INSERT INTO platform (name) VALUES ('<platformNameUppercase>');

-- Example
INSERT INTO platform (name) VALUES ('FRIDGE');
```

### Insert Steam user into users relation
```sql
-- Template
INSERT INTO users (id, platform, username, realname, profileurl, avatar)
VALUES ('<steamID>', 0, '<username>', '<realName>', '<profileUrl>', '<avatar>');

-- Example
INSERT INTO users (id, platform, username, realname, profileurl, avatar)
VALUES ('gabelogannewell', 0, 'Rabscuttle', 'Gabe Newell', 'https://steamcommunity.com/id/gabelogannewell', 'https://avatars.cloudflare.steamstatic.com/c5d56249ee5d28a07db4ac9f7f60af961fab5426_full.jpg');
```

### Insert Epic user into users relation
```sql
-- Template
INSERT INTO users (id, platform, username, preflang)
VALUES ('<accountID>', 1, '<username>', '<preferredLanguage>');

-- Example
INSERT INTO users (id, platform, username, preflang)
VALUES ('novarchite', 1, 'Novarchite', 'en-US');
```

## Queries

### Query for information related to Steam user
```sql
-- Template
SELECT username, realname, profileurl, avatar
FROM users
WHERE id = '<steamID>' AND platform = 0;

-- Example
SELECT username, realname, profileurl, avatar
FROM users
WHERE id = 'gabelogannewell' AND platform = 0;
```

### Query for information related to Epic user
```sql
-- Template
SELECT username, preflang
FROM users
WHERE id = '<accountID>' AND platform = 1;

-- Example
SELECT username, preflang
FROM users
WHERE id = 'novarchite' AND platform = 1;
```

## Updates

### Update username of user
```sql
-- Template
UPDATE users SET username = '<newUsername>' WHERE id = '<id>' AND platform = '<platformID>';

-- Example
UPDATE users SET username = 'TheGabiest' WHERE id = 'gabelogannewell' AND platform = 0;
```

### Update realname of user
```sql
-- Template
UPDATE users SET realname = '<newName>' WHERE id = '<id>' AND platform = 0;

-- Example
UPDATE users SET realname = 'Not Gabe Newell' WHERE id = 'gabelogannewell' AND platform = 0;
```

### Update profileurl of user
```sql
-- Template
UPDATE users SET profileurl = '<newUrl>' WHERE id = '<id>' AND platform = 0;

-- Example
UPDATE users SET profileurl = 'https://new.url' WHERE id = 'gabelogannewell' AND platform = 0;
```

### Update avatar of user
```sql
-- Template
UPDATE users SET avatar = '<newAvatar>' WHERE id = '<id>' AND platform = 0;

-- Example
UPDATE users SET avatar = 'https://avatars.com/gaben' WHERE id = 'gabelogannewell' AND platform = 0;
```

### Update preflang of user
```sql
-- Template
UPDATE users SET preflang = '<newLang>' WHERE id = '<id>' AND platform = 1;

-- Example
UPDATE users SET preflang = 'fr' WHERE id = 'novarchite' AND platform = 1;
```

## Deletes

### Delete all information for Steam user
```sql
-- Template
DELETE FROM users
WHERE id = '<steamID>' AND platform = 0;

-- Example
DELETE FROM users
WHERE id = 'gabelogannewell' AND platform = 0;
```

### Delete all information for Epic user
```sql
-- Template
DELETE FROM users
WHERE id = '<accountID>' AND platform = 1;

-- Example
DELETE FROM users
WHERE id = 'novarchite' AND platform = 1;
```