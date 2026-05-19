export interface Skill {
  /** Folder name in the repo, e.g. "01-dotnet-clean-architecture". Used for stable display order. */
  id: string;
  /** Frontmatter `name`, e.g. "dotnet-clean-architecture". Used as the install target directory name. */
  name: string;
  /** Frontmatter `description`, surfaced in the TUI picker. */
  description: string;
  /** Absolute path to the source skill directory (the one containing SKILL.md). */
  sourceDir: string;
  /** Raw SKILL.md body without YAML frontmatter. Used by transforming agents (Cursor, Copilot). */
  body: string;
}
