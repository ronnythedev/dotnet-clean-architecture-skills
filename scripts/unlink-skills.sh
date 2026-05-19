#!/usr/bin/env bash
set -euo pipefail

# Reverses scripts/link-skills.sh. For every skill in this repo, removes
# the corresponding entry under ~/.claude/skills ONLY IF it is a symlink
# pointing back into this repo. Real directories and symlinks pointing
# elsewhere are left untouched, so unrelated skills you've installed
# from other sources are safe.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.claude/skills"

if [ ! -d "$DEST" ]; then
  echo "$DEST does not exist; nothing to unlink."
  exit 0
fi

removed=0
skipped=0
find "$REPO/skills" -name SKILL.md -not -path '*/node_modules/*' -print0 |
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  name="$(basename "$src")"
  target="$DEST/$name"

  if [ ! -L "$target" ]; then
    if [ -e "$target" ]; then
      echo "skipped $name (not a symlink — left intact)"
      skipped=$((skipped + 1))
    fi
    continue
  fi

  resolved="$(readlink "$target")"
  case "$resolved" in
    "$src")
      rm "$target"
      echo "unlinked $name"
      removed=$((removed + 1))
      ;;
    *)
      echo "skipped $name (symlink points to $resolved, not this repo)"
      skipped=$((skipped + 1))
      ;;
  esac
done

echo ""
echo "Done."
