#!/usr/bin/env bash

set -eo pipefail

# shellcheck disable=SC1091
. "$(git rev-parse --show-toplevel)/tools/scripts/db_utils.sh"

PG_HOST=localhost
PG_PORT_CONTAINER=5432 # Within the container, PG runs on the standard port

# Get command line options
PG_USER=dev_admin
PG_PASSWORD=dev_admin_password
PG_PORT=5440 # On the host, we default to a non-standard port to not clash with local PG
PG_DB=dev_admin
PG_CONTAINER_NAME=f1_challenger_postgres_dev
PG_DATA_VOLUME=f1_challenger_postgres_data_dev

while getopts ":u:w:p:d:c:v:" arg; do
    case $arg in
    u) PG_USER=$OPTARG ;;
    w) PG_PASSWORD=$OPTARG ;;
    p) PG_PORT=$OPTARG ;;
    d) PG_DB=$OPTARG ;;
    c) PG_CONTAINER_NAME=$OPTARG ;;
    v) PG_DATA_VOLUME=$OPTARG ;;
    *)
        echo "usage: $0 [-u user ($PG_USER)] [-w password ($PG_PASSWORD)] [-p port ($PG_PORT)] [-d db_name ($PG_DB)] [-c container_name ($PG_CONTAINER_NAME)] [-v container_volume ($PG_DATA_VOLUME)]" >&2
        exit 1
        ;;
    esac
done

if [ "$(docker ps -q -f name="$PG_CONTAINER_NAME")" ]; then
    echo "Postgres container $PG_CONTAINER_NAME already running"
    exit 0
fi

# Ensure we have a local volume for storing Postgres data, so we don't lose it between runs
docker volume create "$PG_DATA_VOLUME"

# If DB is already running, shut it down
docker rm -f "$PG_CONTAINER_NAME" >/dev/null 2>&1 || true

# Start the DB
docker run \
    --name "$PG_CONTAINER_NAME" \
    -v "$PG_DATA_VOLUME":/var/lib/postgresql/data \
    -e POSTGRES_USER="$PG_USER" \
    -e POSTGRES_PASSWORD="$PG_PASSWORD" \
    -e POSTGRES_DB="$PG_DB" \
    -p "$PG_PORT":"$PG_PORT_CONTAINER" \
    -d \
    postgis/postgis:15-3.3

PG_DB_URL="postgres://$PG_USER:$PG_PASSWORD@$PG_HOST:$PG_PORT_CONTAINER/$PG_DB?sslmode=disable"

# Wait for the DB to come up before letting the script finish
DB_UP=0
while [ "$DB_UP" -eq 0 ]; do
    echo "Waiting for DB to come up ..."
    DB_UP=$(run_sql "$PG_DB_URL" "$PG_CONTAINER_NAME" 'SELECT 1' >/dev/null 2>&1 && echo 1 || echo 0)
    if [ "$DB_UP" -eq 1 ]; then
        echo "DB is up"
    else
        sleep 1
    fi
done
