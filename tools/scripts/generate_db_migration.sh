#!/usr/bin/env bash

set -eo pipefail

migration_name="$1"

if [ "$migration_name" = '' ]; then
    echo >&2 "Must provide a name for the migration"
    exit 1
fi

generate_output=$(yarn drizzle-kit generate --name="$migration_name")

# This saving of the output and removing bad quoting is a hack around a Drizzle bug when generating migrations, that over-quotes
# Can remove this hack once the Drizzle bug is fixed
echo "$generate_output"
# shellcheck disable=SC2001
file_name="$(echo "$generate_output" | grep 'Your SQL migration file' | sed -e 's/.*Your SQL migration file ➜ \(.*\) 🚀.*/\1/')"

sed -i '' 's/"GEOMETRY(POINT,4326)"/GEOMETRY(POINT,4326)/g' "$file_name"
sed -i '' 's/"TIMESTAMP(3) WITH TIME ZONE"/TIMESTAMP(3) WITH TIME ZONE/g' "$file_name"
sed -i '' 's/"TIME WITHOUT TIME ZONE"/TIME WITHOUT TIME ZONE/g' "$file_name"
