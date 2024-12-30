#!/usr/bin/env bash

set -eo pipefail

# shellcheck disable=SC1091
. "$(git rev-parse --show-toplevel)/tools/scripts/db_utils.sh"

pg_db="$1"
admin_db_url=$(get_dev_admin_db_url "$pg_db")
db_url="${2:-$admin_db_url}"
pg_container_name=f1_challenger_postgres_dev
filename="fixtures-$pg_db-$RANDOM.sql"

docker cp ./fixtures.sql "$pg_container_name:/tmp/$filename"
docker exec -t "$pg_container_name" /bin/bash -c "PAGER='' psql ""$db_url"" -f /tmp/$filename"
docker exec -t "$pg_container_name" /bin/bash -c "rm /tmp/$filename"
