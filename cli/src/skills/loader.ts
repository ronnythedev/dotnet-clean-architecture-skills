import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { Skill } from "./types.js";

export function loadSkillsFrom(rootDir: string): Skill[] {
  if (!existsSync(rootDir)) return [];

  const entries = readdirSync(rootDir)
    .filter(name => !name.startsWith("."))
    .map(name => ({ name, full: join(rootDir, name) }))
    .filter(e => statSync(e.full).isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const skills: Skill[] = [];

  for (const entry of entries) {
    const skillMd = join(entry.full, "SKILL.md");
    if (!existsSync(skillMd)) continue;

    const raw = readFileSync(skillMd, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data as Record<string, unknown>;

    if (typeof fm.name !== "string" || !fm.name.trim()) {
      throw new Error(`Skill ${entry.name} is missing required frontmatter field: name`);
    }
    if (typeof fm.description !== "string" || !fm.description.trim()) {
      throw new Error(`Skill ${entry.name} is missing required frontmatter field: description`);
    }

    skills.push({
      id: entry.name,
      name: fm.name.trim(),
      description: fm.description.trim(),
      sourceDir: entry.full,
      body: parsed.content
    });
  }

  return skills;
}
