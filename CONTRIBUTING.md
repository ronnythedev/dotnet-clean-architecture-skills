# Contributing a Skill

Thanks for contributing! This guide covers the conventions every skill follows so the collection stays consistent and predictable for AI assistants.

## Directory & File Naming

```
skills/
  NN-skill-name/SKILL.md          # primary skill
  NN.V-skill-name-variant/SKILL.md # variant (same topic, different approach)
```

- **NN** is a two-digit sequential number (`01`-`99`). Pick the next available number.
- **NN.V** is used for variants of the same concept (e.g., `16.1-email-service-sendgrid` / `16.2-email-service-aws-ses`).
- Skill names are lowercase, hyphen-separated.
- The file is always called `SKILL.md` (not `README.md`).

## Frontmatter

Every skill starts with YAML frontmatter:

```yaml
---
name: my-skill-name
description: "One sentence. What it generates and which pattern it uses."
version: 1.0.0
language: C#
framework: .NET 8+
dependencies: PackageA, PackageB
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `name` | Yes | Lowercase, hyphenated. Must match the directory suffix (e.g., `cqrs-command-generator`). |
| `description` | Yes | ~100-150 chars. Starts with a verb: *Generates*, *Implements*, *Configures*, *Scaffolds*. |
| `version` | Yes | Semver. Start at `1.0.0`. |
| `language` | Yes | `C#` for this repo. |
| `framework` | Yes | `".NET 8+"` unless the skill targets a specific version. |
| `dependencies` | Yes | Comma-separated NuGet package names. |
| `source` | No | Attribution URL (e.g., Microsoft Learn link). |

## Section Structure

Follow this order. Every skill **must** include the sections marked required.

| # | Section | Required | Purpose |
|---|---------|----------|---------|
| 1 | `# Title` | Yes | Descriptive H1 (e.g., *CQRS Command Generator*). |
| 2 | `## Overview` | Yes | 2-3 paragraphs + bullet list of what gets generated. |
| 3 | `## Quick Reference` | Yes | Markdown table summarizing options, types, or algorithms. |
| 4 | `## {Feature} Structure` | Yes | ASCII tree showing generated file layout with `{placeholders}`. |
| 5 | `## Template: {Variation}` | Yes | One or more complete, copy-paste-ready code templates. |
| 6 | Domain-specific sections | No | Additional patterns, configuration, handler examples, etc. |
| 7 | `## Critical Rules` | Yes | Numbered list of hard constraints (aim for 5-10 items). |
| 8 | `## Anti-Patterns to Avoid` | Yes | Side-by-side `// WRONG` / `// CORRECT` code blocks. |
| 9 | `## Related Skills` | Yes | Bullet list linking to complementary skills by `name`. |

## The `{placeholder}` Convention

All code templates use curly-brace placeholders that the AI replaces with actual names at generation time.

| Placeholder | Casing | Example Value |
|-------------|--------|---------------|
| `{name}` | lowercase | `petclinic` |
| `{Name}` | PascalCase | `PetClinic` |
| `{Entity}` | PascalCase | `Product` |
| `{entity}` | camelCase | `product` |
| `{Entities}` | PascalCase plural | `Products` |
| `{entities}` | lowercase plural | `products` |
| `{Feature}` | PascalCase | `Orders` |
| `{Action}` | PascalCase verb | `Create`, `Update`, `Delete` |
| `{Aggregate}` | PascalCase | `Orders` |

File path comments above code blocks use these same placeholders:

```csharp
// src/{name}.application/{Feature}/Create{Entity}/Create{Entity}Command.cs
```

## Code Block Conventions

- Always specify the language identifier: ` ```csharp `.
- Use section separators in long code blocks:
  ```csharp
  // ═══════════════════════════════════════════════════════════════
  // SECTION NAME
  // ═══════════════════════════════════════════════════════════════
  ```
- Include XML doc comments (`/// <summary>`) on public types.
- Use 4-space indentation consistently.

## Writing Good Critical Rules

Critical Rules are numbered imperatives the AI must follow when using the skill. Good rules are:

- **Concrete**: "Domain layer has ZERO dependencies on other layers" not "keep layers separate."
- **Actionable**: Tell the AI what to do, not what to think about.
- **Scoped**: Each rule covers one constraint.

## Registering Your Skill

After creating `skills/NN-my-skill/SKILL.md`:

1. Add a row to the **Skills Index** table in `README.md`.
2. Add `## Related Skills` references in other skills that pair with yours.

## Quick Checklist

- [ ] Directory follows `NN-skill-name/SKILL.md` format
- [ ] Frontmatter has all required fields
- [ ] Sections follow the standard order
- [ ] `{placeholder}` names match the table above
- [ ] Code blocks specify language, use 4-space indent
- [ ] Critical Rules are numbered, concrete, and actionable
- [ ] Anti-Patterns show wrong vs. correct side by side
- [ ] Related Skills reference existing skills by `name`
- [ ] README.md Skills Index updated
