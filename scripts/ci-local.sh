#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/ci-local.sh [--badges|--no-badges]

Local equivalent of .github/workflows/ci.yml:
- npm ci
- React 18 pass: typecheck, lint, test:coverage, smoke:consumer
- React 19 pass: install React 19 + types, then typecheck, lint, test:coverage
- Coverage badge generation controlled by explicit flags (default: --badges)
EOF
}

GENERATE_BADGES="true"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --badges)
      GENERATE_BADGES="true"
      shift
      ;;
    --no-badges)
      GENERATE_BADGES="false"
      shift
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

echo "==> Install dependencies (npm ci)"
npm ci

echo "==> React 18 job"
npm run typecheck
npm run lint
npm run test:coverage
npm run smoke:consumer

echo "==> Reset dependencies before React 19 job"
npm ci

echo "==> React 19 job (temporary dependency switch)"
npm install --no-save react@19 react-dom@19 @types/react@19 @types/react-dom@19
npm run typecheck
npm run lint
npm run test:coverage

if [[ "$GENERATE_BADGES" == "true" ]]; then
  echo "==> Generate coverage badges"
  node ./scripts/generate-coverage-badges.mjs
else
  echo "==> Skip coverage badges"
fi

echo "CI local workflow completed successfully."
