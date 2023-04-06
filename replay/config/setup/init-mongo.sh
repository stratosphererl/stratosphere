#!/bin/bash
set -e
# set -e causes the whole script to exit when a command fails, so the script can't silently fail and startup mongo.

if [ "$MONGO_INITDB_ROOT_USERNAME" ] && [ "$MONGO_INITDB_ROOT_PASSWORD" ]; then 
  rootAuthDatabase='admin' 

  "${mongo[@]}" "$rootAuthDatabase" <<-EOJS 
    db.createUser({ 
      user: $(_js_escape "$MONGO_INITDB_ROOT_USERNAME"), 
      pwd: $(_js_escape "$MONGO_INITDB_ROOT_PASSWORD"), 
      roles: [ { role: 'root', db: $(_js_escape "$rootAuthDatabase") } ] 
    }) 
  EOJS 
fi 

mongo <<EOF
use ${MONGO_INITDB_DATABASE}
db.createCollection("users")
db.users.insert({"name": "mike"})
EOF