#!/bin/bash
# Script para eliminar y crear la base de datos nutriapp en PostgreSQL

# Prefer DATABASE_URL if set; otherwise use local defaults.
DB_NAME="nutriapp" # Cambia por el nombre de_debugdatabase si es diferente
DB_USER="${DB_USER:-$(whoami)}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"

if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "Usando DATABASE_URL para resetear la base de datos..."
  psql "${DATABASE_URL}" -c "DROP DATABASE IF EXISTS ${DB_NAME};"
  psql "${DATABASE_URL}" -c "CREATE DATABASE ${DB_NAME};"
  echo "Base de datos ${DB_NAME} eliminada y creada nuevamente."
  exit 0
fi

# Eliminar la base de datos (termina conexiones activas)
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${DB_NAME}' AND pid <> pg_backend_pid();"
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"

# Crear la base de datos
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME};"

echo "Base de datos $DB_NAME eliminada y creada nuevamente."
