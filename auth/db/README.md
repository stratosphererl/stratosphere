### Insert Steam user into users relation
```sql
INSERT INTO users
VALUES ("<steamID>", 0, "<username>", "<realName>", "<profileUrl>", "<avatar>", null)
```

### Insert Epic user into users relation
```sql
INSERT INTO users
VALUES ("<accountID>", 1, "<displayName>", null, null, null, "<preferredLanguage)
```