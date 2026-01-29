#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
INFRA_DIR="${REPO_ROOT}/infra"
ENV_FILE_DEFAULT="${REPO_ROOT}/.env.pulumi"

ENV_FILE="${ENV_FILE_DEFAULT}"

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--env <path>]

Imports an existing Vercel project into the prod stack by setting:
- vercelProjectId
- vercelProjectName
- vercelImportProjectId

Requirements in the env file:
- VERCEL_IMPORT_PROJECT_ID
- VERCEL_IMPORT_PROJECT_NAME
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_FILE="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing env file: ${ENV_FILE}" >&2
  echo "Create it from .env.pulumi.example" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ -z "${VERCEL_IMPORT_PROJECT_ID:-}" ]]; then
  echo "Missing VERCEL_IMPORT_PROJECT_ID in ${ENV_FILE}" >&2
  exit 1
fi

if [[ -z "${VERCEL_IMPORT_PROJECT_NAME:-}" ]]; then
  echo "Missing VERCEL_IMPORT_PROJECT_NAME in ${ENV_FILE}" >&2
  exit 1
fi

pulumi -C "${INFRA_DIR}" config set vercelProjectId "${VERCEL_IMPORT_PROJECT_ID}" --stack prod
pulumi -C "${INFRA_DIR}" config set vercelProjectName "${VERCEL_IMPORT_PROJECT_NAME}" --stack prod
pulumi -C "${INFRA_DIR}" config set vercelImportProjectId "${VERCEL_IMPORT_PROJECT_ID}" --stack prod

echo "Prod stack updated. Next steps:"
echo "  ./infra/scripts/pulumi-env.sh -- up --stack prod --yes"
echo "  pulumi -C infra config rm vercelImportProjectId --stack prod"
