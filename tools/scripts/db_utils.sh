#!/usr/bin/env bash

get_dev_admin_db_url() {
    local pg_user=dev_admin
    local pg_password=dev_admin_password
    local pg_host=localhost
    local pg_port=5432
    local pg_db="$1"
    if [ "$pg_db" = '' ]; then
        echo >&2 "Failed to provide DB name"
        exit 1
    fi
    echo "postgres://$pg_user:$pg_password@$pg_host:$pg_port/$pg_db?sslmode=disable"
}

run_sql() {
    local db_url="$1"
    if [ "$db_url" = '' ]; then
        echo >&2 "Failed to provide DB URL"
        exit 1
    fi
    local container_name="$2"
    if [ "$container_name" = '' ]; then
        echo >&2 "Failed to provide container name"
        exit 1
    fi
    local sql="${*:3}"
    if [ "$sql" = '' ]; then
        echo >&2 "Failed to provide SQL to run"
        exit 1
    fi
    docker exec -t "$container_name" /bin/bash -c "PAGER='' psql $db_url -c \"$sql\""
}
