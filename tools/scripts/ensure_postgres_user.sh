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
        echo "Must set $description using the flag $flag"
        exit 1
    fi
}

PG_ADMIN_USER=dev_admin
PG_ADMIN_PASSWORD=dev_admin_password
PG_NEW_USER=
PG_NEW_PASSWORD=
PG_DB=
PG_CONTAINER_NAME=f1_challenger_postgres_dev

while getopts ":a:o:u:w:d:c:" arg; do
    case $arg in
    a) PG_ADMIN_USER=$OPTARG ;;
    o) PG_ADMIN_PASSWORD=$OPTARG ;;
    u) PG_NEW_USER=$OPTARG ;;
    w) PG_NEW_PASSWORD=$OPTARG ;;
    d) PG_DB=$OPTARG ;;
    c) PG_CONTAINER_NAME=$OPTARG ;;
    *)
        echo "usage: $0 [-a admin_user ($PG_ADMIN_USER)] [-o admin_password ($PG_ADMIN_PASSWORD)] [-u user] [-w password] [-d db_name] [-c container_name ($PG_CONTAINER_NAME)]" >&2
        exit 1
        ;;
    esac
done

require_arg d PG_DB 'database'
PG_DB_URL="postgres://$PG_ADMIN_USER:$PG_ADMIN_PASSWORD@$PG_HOST:$PG_PORT_CONTAINER/$PG_DB?sslmode=disable"

# Create the user (with full access to the database), if they don't exist
if ! run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "SELECT usename FROM pg_catalog.pg_user WHERE usename = '$PG_NEW_USER'" | grep "$PG_NEW_USER" >/dev/null; then
    echo "User $PG_NEW_USER does not exist, creating it"
    run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "CREATE USER $PG_NEW_USER WITH PASSWORD '$PG_NEW_PASSWORD'"
    run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "GRANT ALL ON DATABASE $PG_DB TO $PG_NEW_USER WITH GRANT OPTION"
    run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "GRANT ALL ON SCHEMA public TO $PG_NEW_USER"
    run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $PG_NEW_USER WITH GRANT OPTION"
    run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" "ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC GRANT ALL ON TABLES TO $PG_NEW_USER WITH GRANT OPTION"
else
    echo "User $PG_NEW_USER already exists, skipping creation"
fi

# Grant the user full access to the database
