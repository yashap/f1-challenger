#!/usr/bin/env bash

set -eo pipefail

# shellcheck disable=SC1091
. "$(git rev-parse --show-toplevel)/tools/scripts/db_utils.sh"

PG_HOST=localhost
PG_PORT_CONTAINER=5432

# Get command line options
require_arg() {
    local flag="$1"
    local env_var="$2"
    local description="$3"
    if [[ -z ${!env_var} ]]; then
        echo "Must set $description using the flag $flag (e.g. -$flag [$description])"
        exit 1
    fi
}

PG_USER=dev_admin
PG_PASSWORD=dev_admin_password
PG_ADMIN_DB=dev_admin
PG_DB=
PG_CONTAINER_NAME=f1_challenger_postgres_dev

while getopts ":u:w:d:a:c:" arg; do
    case $arg in
    u) PG_USER=$OPTARG ;;
    w) PG_PASSWORD=$OPTARG ;;
    d) PG_DB=$OPTARG ;;
    a) PG_ADMIN_DB=$OPTARG ;;
    c) PG_CONTAINER_NAME=$OPTARG ;;
    *)
        echo "usage: $0 [-u user ($PG_USER)] [-w password ($PG_PASSWORD)] [-d db_name] [-a admin_db_name ($PG_ADMIN_DB)] [-c container_name ($PG_CONTAINER_NAME)]" >&2
        exit 1
        ;;
    esac
done

require_arg d PG_DB 'database'
PG_DB_URL="postgres://$PG_USER:$PG_PASSWORD@$PG_HOST:$PG_PORT_CONTAINER/$PG_ADMIN_DB?sslmode=disable"

# Create the database if it doesn't exist
if ! run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "SELECT datname FROM pg_database WHERE datname = '$PG_DB'" | grep "$PG_DB" >/dev/null; then
    echo "Database $PG_DB does not exist, creating it"
    run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "CREATE DATABASE $PG_DB"
else
    echo "Database $PG_DB already exists, skipping creation"
fi
