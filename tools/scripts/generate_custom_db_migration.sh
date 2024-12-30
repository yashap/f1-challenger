#!/usr/bin/env bash

set -eo pipefail

migration_name="$1"

if [ "$migration_name" = '' ]; then
    echo >&2 "Must provide a name for the migration"
    exit 1
fi

yarn drizzle-kit generate --custom --name="$migration_name"
