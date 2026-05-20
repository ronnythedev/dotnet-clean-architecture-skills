# dotnet-clean-arch

Interactive installer for the [.NET Clean Architecture skills](https://github.com/ronnydelgado/dotnet-clean-architecture-skills) — installs them into Claude Code, Cursor, or GitHub Copilot via a TUI with multi-select, agent auto-detection, and scope/method prompts.

## Quickstart

```bash
npx dotnet-clean-arch
```

Pick your agent, pick your skills, done.

## Commands

| Command | Description |
|---|---|
| `npx dotnet-clean-arch` (or `add`) | Interactive install flow |
| `npx dotnet-clean-arch list` | Show available skills and supported agents |
| `npx dotnet-clean-arch remove` | Reverse previous installs from the manifest |

## Supported agents

| Agent | Scope | Output |
|---|---|---|
| Claude Code | global (`~/.claude/skills/`) or project (`./.claude/skills/`) | Skill folder, copied or symlinked |
| Cursor | project only (`.cursor/rules/`) | `<name>.mdc` with description frontmatter |
| GitHub Copilot | project only (`.github/instructions/`) | `<name>.instructions.md` with `applyTo: **/*.cs,**/*.csproj,**/*.sln` |

## Reverse an install

The CLI records every install in `~/.dotnet-clean-arch/manifest.json`. `npx dotnet-clean-arch remove` reads that manifest and reverses each entry — it never touches files we didn't put there.

## Source of truth

The skill content itself lives at https://github.com/ronnydelgado/dotnet-clean-architecture-skills. This package bundles a frozen snapshot for offline installs; the package version reflects the skills snapshot it ships with.
