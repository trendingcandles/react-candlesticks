#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/release-local.sh [--npm-tag latest|next] [--dry-run true|false]

Local equivalent of .github/workflows/release.yml:
- npm ci
- npm run check
- npm run pack:check
- npm run smoke:consumer
- npm publish --tag <npm-tag> (unless dry-run=true)
EOF
}

NPM_TAG="latest"
DRY_RUN="true"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --npm-tag)
      NPM_TAG="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "$NPM_TAG" != "latest" && "$NPM_TAG" != "next" ]]; then
  echo "Invalid --npm-tag value: $NPM_TAG (allowed: latest, next)" >&2
  exit 1
fi

if [[ "$DRY_RUN" != "true" && "$DRY_RUN" != "false" ]]; then
  echo "Invalid --dry-run value: $DRY_RUN (allowed: true, false)" >&2
  exit 1
fi

echo "==> Install dependencies (npm ci)"
npm ci

echo "==> Verify package quality"
npm run check

echo "==> Verify published tarball"
npm run pack:check

echo "==> Smoke test packed consumer install"
npm run smoke:consumer

if [[ "$DRY_RUN" == "false" ]]; then
  if [[ -z "${NPM_TOKEN:-}" ]]; then
    echo "NPM_TOKEN is not set. Export it before publishing." >&2
    exit 1
  fi
  echo "==> Publish to npm with tag: $NPM_TAG"
  NODE_AUTH_TOKEN="$NPM_TOKEN" npm publish --tag "$NPM_TAG"
else
  echo "Dry run completed. Package was not published."
fi
