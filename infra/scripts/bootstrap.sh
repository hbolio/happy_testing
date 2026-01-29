#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
INFRA_DIR="${REPO_ROOT}/infra"
ENV_FILE_DEFAULT="${REPO_ROOT}/.env.pulumi"

DRY_RUN=1
ENV_FILE="${ENV_FILE_DEFAULT}"

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--env <path>] [--apply]

Options:
  --env <path>   Path to env file (default: ${ENV_FILE_DEFAULT})
  --apply        Execute commands (default is dry-run)
  --help         Show this help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_FILE="$2"
      shift 2
      ;;
    --apply)
      DRY_RUN=0
      shift
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

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env var: ${name}" >&2
    return 1
  fi
}

DB_PROVIDER="${DB_PROVIDER:-supabase}"
APP_NAME="${APP_NAME:-happy-testing}"
VERCEL_FRAMEWORK="${VERCEL_FRAMEWORK:-nextjs}"

missing=0
require_var PULUMI_ACCESS_TOKEN || missing=1
require_var VERCEL_TOKEN || missing=1
require_var VERCEL_ORG_ID || missing=1
require_var VERCEL_PROJECT_ID || missing=1

if [[ "${DB_PROVIDER}" == "supabase" ]]; then
  require_var SUPABASE_ACCESS_TOKEN || missing=1
  require_var SUPABASE_ORG_ID || missing=1
  require_var SUPABASE_DB_PASSWORD || missing=1
elif [[ "${DB_PROVIDER}" == "neon" ]]; then
  require_var NEON_API_KEY || missing=1
  require_var NEON_ORG_ID || missing=1
  require_var NEON_REGION_ID || missing=1
else
  echo "Unsupported DB_PROVIDER: ${DB_PROVIDER} (use supabase or neon)" >&2
  exit 1
fi

if [[ ${missing} -ne 0 ]]; then
  exit 1
fi

run() {
  if [[ ${DRY_RUN} -eq 1 ]]; then
    echo "[dry-run] $*"
  else
    echo "+ $*"
    "$@"
  fi
}

if ! command -v pulumi >/dev/null 2>&1; then
  echo "Pulumi CLI not found. Install from https://www.pulumi.com/docs/install/" >&2
  exit 1
fi

export PULUMI_ACCESS_TOKEN
export VERCEL_API_TOKEN="${VERCEL_TOKEN}"
export VERCEL_ORG_ID
export VERCEL_PROJECT_ID

if [[ "${DB_PROVIDER}" == "supabase" ]]; then
  export SUPABASE_ACCESS_TOKEN
else
  export NEON_API_KEY
fi

run pulumi login

# Generate provider SDKs locally (Terraform-bridge providers are not on npm)
run pulumi -C "${INFRA_DIR}" package add terraform-provider supabase/supabase
run pulumi -C "${INFRA_DIR}" package add terraform-provider kislerdm/neon

run npm --prefix "${INFRA_DIR}" install

bootstrap_stack() {
  local stack="$1"

  run pulumi -C "${INFRA_DIR}" stack init "${stack}" || run pulumi -C "${INFRA_DIR}" stack select "${stack}"

  run pulumi -C "${INFRA_DIR}" config set appName "${APP_NAME}" --stack "${stack}"
  run pulumi -C "${INFRA_DIR}" config set dbProvider "${DB_PROVIDER}" --stack "${stack}"
  run pulumi -C "${INFRA_DIR}" config set vercelProjectId "${VERCEL_PROJECT_ID}" --stack "${stack}"
  run pulumi -C "${INFRA_DIR}" config set vercelTeamId "${VERCEL_ORG_ID}" --stack "${stack}"
  run pulumi -C "${INFRA_DIR}" config set vercelFramework "${VERCEL_FRAMEWORK}" --stack "${stack}"
  if [[ -n "${VERCEL_IMPORT_PROJECT_ID:-}" ]]; then
    run pulumi -C "${INFRA_DIR}" config set vercelImportProjectId "${VERCEL_IMPORT_PROJECT_ID}" --stack "${stack}"
  fi

  if [[ -n "${VERCEL_ROOT_DIRECTORY:-}" ]]; then
    run pulumi -C "${INFRA_DIR}" config set vercelRootDirectory "${VERCEL_ROOT_DIRECTORY}" --stack "${stack}"
  fi

  if [[ "${DB_PROVIDER}" == "supabase" ]]; then
    run pulumi -C "${INFRA_DIR}" config set supabaseOrganizationId "${SUPABASE_ORG_ID}" --stack "${stack}"
    run pulumi -C "${INFRA_DIR}" config set supabaseRegion "${SUPABASE_REGION:-us-east-1}" --stack "${stack}"
    if [[ -n "${SUPABASE_INSTANCE_SIZE:-}" ]]; then
      run pulumi -C "${INFRA_DIR}" config set supabaseInstanceSize "${SUPABASE_INSTANCE_SIZE}" --stack "${stack}"
    fi
    run pulumi -C "${INFRA_DIR}" config set --secret supabaseDbPassword "${SUPABASE_DB_PASSWORD}" --stack "${stack}"
  else
    run pulumi -C "${INFRA_DIR}" config set neonOrgId "${NEON_ORG_ID}" --stack "${stack}"
    run pulumi -C "${INFRA_DIR}" config set neonRegionId "${NEON_REGION_ID}" --stack "${stack}"
  fi
}

bootstrap_stack dev
bootstrap_stack prod

echo "Done. Dry-run=${DRY_RUN}"
