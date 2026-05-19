#!/usr/bin/env bash
set -euo pipefail

# Lists every SKILL.md path in this repo, relative to the repo root.

REPO="$(cd "$(dirname "$0")/.." && pwd)"

cd "$REPO"
find . -name SKILL.md -not -path '*/node_modules/*' | sed 's|^\./||' | sort
