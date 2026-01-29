#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ENV_FILE_DEFAULT="${REPO_ROOT}/.env.pulumi"

ENV_FILE="${ENV_FILE_DEFAULT}"
PULUMI_ARGS=()

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--env <path>] -- <pulumi args>

Examples:
  ./infra/scripts/pulumi-env.sh -- preview --stack dev
  ./infra/scripts/pulumi-env.sh -- up --stack prod
  ./infra/scripts/pulumi-env.sh --env .env.pulumi -- preview --stack dev
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
    --)
      shift
      PULUMI_ARGS=("$@")
      break
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ${#PULUMI_ARGS[@]} -eq 0 ]]; then
  echo "Missing pulumi args. Use -- to separate args." >&2
  usage
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing env file: ${ENV_FILE}" >&2
  echo "Create it from .env.pulumi.example" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Missing VERCEL_TOKEN in ${ENV_FILE}" >&2
  exit 1
fi

export VERCEL_API_TOKEN="${VERCEL_TOKEN}"

if [[ -z "${PULUMI_ACCESS_TOKEN:-}" ]]; then
  echo "Missing PULUMI_ACCESS_TOKEN in ${ENV_FILE}" >&2
  exit 1
fi

exec pulumi -C "${REPO_ROOT}/infra" "${PULUMI_ARGS[@]}"
