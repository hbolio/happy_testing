#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found. Install Postgres client to run local CI parity." >&2
  exit 1
fi

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set. Export it before running." >&2
  exit 1
fi

cd "${ROOT_DIR}"

npm ci
npx prisma generate
npx prisma migrate deploy
node --loader ts-node/esm seed.ts
npm run build
npx playwright test --list
