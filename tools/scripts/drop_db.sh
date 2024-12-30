#!/usr/bin/env bash

set -eo pipefail

# shellcheck disable=SC1091
. "$(git rev-parse --show-toplevel)/tools/scripts/db_utils.sh"

pg_db="$1"
container_name="${2:-f1_challenger_postgres_dev}"
db_url=$(get_dev_admin_db_url dev_admin)

run_sql "$db_url" "$container_name" "DROP DATABASE IF EXISTS $pg_db"
