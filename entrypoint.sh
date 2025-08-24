#!/bin/sh
set -e

# Wait for the DB to be ready
until nc -z mysql-server 3306; do
  echo "Waiting for MySQL..."
  sleep 2
done

npx prisma migrate deploy

npm run seedAdmin

exec node dist/index.js
