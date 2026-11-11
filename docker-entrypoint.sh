#!/bin/sh
set -e
npx prisma migrate deploy
node dist/database/seed/seed.js
exec node dist/main.js
