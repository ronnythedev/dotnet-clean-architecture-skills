#!/usr/bin/env bash
set -euo pipefail

# Links every skill in this repo into ~/.claude/skills, so Claude Code
# discovers them globally across all projects.
#
# Re-running is safe: existing symlinks are refreshed; existing real
# directories at the target path are replaced (the user's own files
# elsewhere in ~/.claude/skills are never touched).

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.claude/skills"

# Guard against the degenerate case where ~/.claude/skills is itself a
# symlink pointing into this repo. If it were, the per-skill symlinks
# we're about to create would land back inside the repo's own skills/
# tree and corrupt the working copy.
if [ -L "$DEST" ]; then
  resolved="$(readlink "$DEST")"
  case "$resolved" in
    "$REPO"|"$REPO"/*)
      echo "error: $DEST is a symlink into this repo ($resolved)." >&2
      echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
      exit 1
      ;;
  esac
fi

mkdir -p "$DEST"

count=0
find "$REPO/skills" -name SKILL.md -not -path '*/node_modules/*' -print0 |
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  name="$(basename "$src")"
  target="$DEST/$name"

  if [ -e "$target" ] && [ ! -L "$target" ]; then
    rm -rf "$target"
  fi

  ln -sfn "$src" "$target"
  echo "linked $name -> $src"
  count=$((count + 1))
done

echo ""
echo "Done. Skills are linked into $DEST."
echo "Run scripts/unlink-skills.sh to reverse this."
