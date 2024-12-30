#!/usr/bin/env bash

set -eo pipefail

# shellcheck disable=SC1091
. "$(git rev-parse --show-toplevel)/tools/scripts/db_utils.sh"

db_url=$(get_dev_admin_db_url "$1")
container_name=f1_challenger_postgres_dev

docker exec -t "$container_name" /bin/bash -c "pg_dump --column-inserts --inserts --quote-all-identifiers --no-owner --disable-dollar-quoting ""$db_url""" >fixtures.sql
