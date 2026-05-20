# Releasing `dotnet-clean-arch`

Internal runbook for cutting a new release of the npm CLI. Read this end-to-end before your first release after a long gap; consult the **Quick reference** at the bottom for everyday patch releases.

---

## What lives where

| Thing | Location |
|---|---|
| Package on npm | https://www.npmjs.com/package/dotnet-clean-arch |
| Canonical source | https://github.com/ronnythedev/dotnet-clean-architecture-skills |
| CLI source | `cli/` subdirectory of the source repo |
| Built bundle (gitignored) | `cli/dist/cli.cjs` + `cli/dist/skills/` |
| Local install target (end user) | `~/.dotnet-clean-arch/manifest.json` (records every install for the `remove` command) |
| Skills source of truth | `skills/` at the repo root |

The CLI bundles a frozen snapshot of `../skills/` at publish time. **The skills the user gets are whatever was in `skills/` when you ran `npm run build`.** Source skill changes don't reach users until you ship a new version.

---

## Versioning policy

[Semantic versioning](https://semver.org/). Bump the version in `cli/package.json`:

| Bump | When |
|---|---|
| **patch** (`0.1.0` → `0.1.1`) | Bug fix, doc fix, dependency bump, metadata fix (e.g., wrong repository URL). No behavior change visible to users. |
| **minor** (`0.1.0` → `0.2.0`) | New feature: new agent adapter, new CLI command, new install method. Backwards-compatible. |
| **major** (`0.1.0` → `1.0.0`) | Breaking change to the CLI surface or manifest format. Old installs may not be removable by the new CLI, or vice versa. |

For the **skills themselves** (content in `skills/*/`), any change ships as a minor or patch bump of the CLI, since the CLI is the only artifact users install. If you ever change skill **naming conventions** (like the `dotnet-` prefix rename), that's a major bump because users may have references that break.

---

## Pre-release checklist

Before you start, all of these should be true:

- [ ] Working tree is clean (`git status` shows nothing pending)
- [ ] You're on `main` (or the branch you intend to ship from)
- [ ] Local main is up to date with `origin/main` (`git pull`)
- [ ] All tests pass: `cd cli && npm test` — expect `36 passed` or whatever the current count is
- [ ] Typecheck clean: `cd cli && npx tsc --noEmit`
- [ ] You're logged in to npm: `npm whoami`
- [ ] 2FA is enabled on your npm account (required for publishing). Verify at `https://www.npmjs.com/settings/<your-username>/two-factor-auth`
- [ ] You have a fresh authenticator-app OTP ready (you'll be prompted during publish)
- [ ] You have a draft commit message and tag name in mind

---

## Release steps

### 1. Bump version

Edit `cli/package.json`:

```json
"version": "0.1.2",
```

Don't add a leading `v` or any suffix — npm wants bare semver.

### 2. Clean build, test, pack

```bash
cd cli
rm -rf dist *.tgz
npm run build
npm test
npm pack --dry-run | tail -20   # verify file count and total size
```

What you're verifying in the dry-run:
- `total files` should match expectation (currently 32: `cli.cjs` + 29 SKILL.md + README + package.json)
- `package size` should be reasonable (~186 KB packed at this size)
- The right files are included; no `src/`, `tests/`, or `scripts/` (those are in `.npmignore`)

### 3. Smoke test locally (do not skip)

```bash
cd cli
npm pack                                          # produces dotnet-clean-arch-X.Y.Z.tgz
npm uninstall -g dotnet-clean-arch 2>/dev/null    # clear old global install
npm install -g "$(pwd)/dotnet-clean-arch-X.Y.Z.tgz"

# Basic sanity
dotnet-clean-arch --version       # should print X.Y.Z
dotnet-clean-arch --help          # all commands listed
dotnet-clean-arch list | head -5  # shows agents + first few skills

# Optional: full TUI smoke test against a tmp project
mkdir -p /tmp/release-smoke && cd /tmp/release-smoke
dotnet-clean-arch                 # pick a small subset, install, verify
dotnet-clean-arch remove          # verify cleanup; manifest should end at "entries": []
```

If anything weird happens, **do not publish** — fix it locally first.

### 4. Publish to npm

```bash
cd cli
npm publish --access public
```

You'll be prompted for your 2FA OTP. Enter the code from your authenticator app.

Verify the publish landed:
- The CLI exits with `+ dotnet-clean-arch@X.Y.Z`
- https://www.npmjs.com/package/dotnet-clean-arch shows the new version within ~30 seconds
- Click "Repository" on the npm page — it should land at the correct GitHub repo

### 5. Commit + tag

```bash
cd ..   # back to repo root

git add cli/package.json [any other changed files]
git commit -m "chore(cli): release vX.Y.Z

[one-line summary of what's in this release]
"

git tag -a cli-vX.Y.Z -m "dotnet-clean-arch CLI vX.Y.Z — [short description]"

git push origin main
git push origin cli-vX.Y.Z
```

### 6. Verify end-to-end from a clean environment

```bash
mkdir -p /tmp/post-release-verify && cd /tmp/post-release-verify
npx dotnet-clean-arch@latest list | head -5
```

If `npx` reports the wrong version, give npm's CDN another minute and retry. If it persists, check `npm view dotnet-clean-arch versions` to confirm what's actually published.

---

## Recovery patterns

### npm publish failed mid-way

If `npm publish` errored out before the version was uploaded:
- Check `npm view dotnet-clean-arch versions` — if your version isn't listed, you're safe to retry.
- Common cause: wrong 2FA OTP (codes rotate every 30s — grab a fresh one).

### Published the wrong thing

**Within 72 hours of publish**, you can `npm unpublish dotnet-clean-arch@X.Y.Z` to remove a specific version. After 72 hours, you can't unpublish individual versions — you can only **deprecate** them with a message:

```bash
npm deprecate dotnet-clean-arch@X.Y.Z "Use X.Y.Z+1 instead — fixes <issue>"
```

The deprecated version stays installable but shows a warning. **The right answer 99% of the time is to ship a higher patch version with the fix**, not to unpublish. That's what we did for the GitHub URL bug (v0.1.0 → v0.1.1).

### Git push fails with `Error in the HTTP2 framing layer`

Transient. Retry, or force HTTP/1.1 for that one command:

```bash
git -c http.version=HTTP/1.1 push origin cli-vX.Y.Z
```

If you want a persistent fix (not really needed): `git config --global http.version HTTP/1.1`.

### Tag pushed but commit wasn't

```bash
git push origin main                    # push the commit
git push origin --delete cli-vX.Y.Z     # delete the orphaned tag on remote
git tag -d cli-vX.Y.Z                   # delete locally
# ...re-do the tag from the right commit
```

### Need to publish from a non-main branch (don't, but if you must)

npm doesn't care which branch you're on — it uploads `cli/` contents. **But** the `repository.url` in `package.json` points users at `main`. If you publish from a branch, anyone clicking through from npm to GitHub will see stale or missing code. Avoid unless you have a genuine reason.

---

## What NOT to do

- **Never edit a published version.** Once `X.Y.Z` is on npm, it's frozen. Ship `X.Y.(Z+1)` instead.
- **Never publish without a local pack-and-install smoke test.** The `prepublishOnly` script runs build + tests, but only a real install catches packaging mistakes (missing files, broken `bin`, etc).
- **Never reuse a tag name.** If `cli-v0.1.0` exists locally or remotely, don't recreate it; bump the version.
- **Never publish with 2FA disabled.** npm will let you do it for a brand-new package but will eventually require it, and once required, you can't easily re-enable from a panic state.
- **Never commit `cli/node_modules/` or `cli/dist/`.** The `cli/.npmignore` controls what ships to npm; the root `.gitignore` should keep these out of git.

---

## Future improvements (not blocking)

When the release cadence picks up, consider:

- **CI/CD via GitHub Actions** — auto-publish on tag push. Saves the manual `npm publish` step but requires storing an npm `NPM_TOKEN` secret in the GitHub repo. Worth it once you've shipped 3+ releases manually and the steps feel rote.
- **CHANGELOG.md** — append release notes per version. Tools like `git-cliff` or `release-please` can generate this from conventional commits. The commit messages in this repo already follow Conventional Commits, so the changelog would be one config away.
- **Smoke-test CI job** — install the just-published version in a clean container and run `dotnet-clean-arch list` to verify the package is healthy before users hit it.
- **Beta tag for previews** — `npm publish --tag beta` ships a version that users only get if they explicitly run `npm install dotnet-clean-arch@beta`. Useful when you want feedback on a risky change without affecting `@latest`.

---

## Quick reference (everyday patch release)

```bash
# 1. Bump version in cli/package.json (e.g., 0.1.1 -> 0.1.2)

# 2. Clean, build, test, pack
cd cli && rm -rf dist *.tgz && npm run build && npm test && npm pack

# 3. Local smoke test
npm uninstall -g dotnet-clean-arch 2>/dev/null
npm install -g "$(pwd)/dotnet-clean-arch-0.1.2.tgz"
dotnet-clean-arch --version

# 4. Publish (will prompt for 2FA OTP)
npm publish --access public

# 5. Commit + tag + push
cd ..
git add cli/package.json
git commit -m "chore(cli): release v0.1.2"
git tag -a cli-v0.1.2 -m "dotnet-clean-arch CLI v0.1.2"
git push origin main
git push origin cli-v0.1.2

# 6. Verify
npx dotnet-clean-arch@latest --version
```
