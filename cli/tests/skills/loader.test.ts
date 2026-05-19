import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadSkillsFrom } from "../../src/skills/loader.js";
import { createTmpDir, removeTmpDir, writeFixtureSkills } from "../helpers/tmp-dir.js";

describe("loadSkillsFrom", () => {
  let tmp: string;

  beforeEach(() => { tmp = createTmpDir(); });
  afterEach(() => { removeTmpDir(tmp); });

  it("returns empty array when directory has no skills", () => {
    expect(loadSkillsFrom(tmp)).toEqual([]);
  });

  it("loads skills sorted by folder name (stable order)", () => {
    writeFixtureSkills(tmp, [
      { folder: "02-second", name: "second", description: "Second skill" },
      { folder: "01-first", name: "first", description: "First skill" }
    ]);

    const skills = loadSkillsFrom(tmp);

    expect(skills).toHaveLength(2);
    expect(skills[0]!.id).toBe("01-first");
    expect(skills[1]!.id).toBe("02-second");
  });

  it("parses name, description, and body from frontmatter", () => {
    writeFixtureSkills(tmp, [
      { folder: "01-x", name: "skill-x", description: "Does X", body: "# Body\n\nText." }
    ]);

    const [skill] = loadSkillsFrom(tmp);

    expect(skill!.name).toBe("skill-x");
    expect(skill!.description).toBe("Does X");
    expect(skill!.body.trim()).toBe("# Body\n\nText.");
    expect(skill!.sourceDir).toMatch(/01-x$/);
  });

  it("skips folders without SKILL.md", () => {
    writeFixtureSkills(tmp, [
      { folder: "01-valid", name: "valid", description: "Valid skill" }
    ]);
    mkdirSync(join(tmp, "02-empty"));

    expect(loadSkillsFrom(tmp)).toHaveLength(1);
  });

  it("throws if SKILL.md frontmatter lacks name", () => {
    mkdirSync(join(tmp, "bad"));
    writeFileSync(join(tmp, "bad", "SKILL.md"), "---\ndescription: x\n---\nbody", "utf8");

    expect(() => loadSkillsFrom(tmp)).toThrow(/missing.*name/i);
  });
});
