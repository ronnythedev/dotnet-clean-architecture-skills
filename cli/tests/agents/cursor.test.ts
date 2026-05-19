import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import matter from "gray-matter";
import { CursorAgent } from "../../src/agents/cursor.js";
import { createTmpDir, removeTmpDir } from "../helpers/tmp-dir.js";
import type { Skill } from "../../src/skills/types.js";

function buildSkill(tmp: string): Skill {
  const dir = join(tmp, "src", "01-x");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "SKILL.md"),
    `---\nname: my-skill\ndescription: "Does the thing"\n---\n\n# Body\n\nRules go here.`, "utf8");
  return {
    id: "01-x",
    name: "my-skill",
    description: "Does the thing",
    sourceDir: dir,
    body: "# Body\n\nRules go here."
  };
}

describe("CursorAgent", () => {
  let tmp: string;
  let agent: CursorAgent;

  beforeEach(() => {
    tmp = createTmpDir();
    agent = new CursorAgent();
  });
  afterEach(() => removeTmpDir(tmp));

  it("only supports project scope", () => {
    expect(agent.supportedScopes).toEqual(["project"]);
  });

  it("detect returns true when project has .cursor/", () => {
    mkdirSync(join(tmp, ".cursor"), { recursive: true });
    expect(agent.detect(tmp)).toBe(true);
  });

  it("detect returns false when no .cursor/", () => {
    expect(agent.detect(tmp)).toBe(false);
  });

  it("install writes a .mdc file to .cursor/rules/<name>.mdc", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: tmp
    });

    expect(target).toBe(join(tmp, ".cursor", "rules", "my-skill.mdc"));
    expect(existsSync(target)).toBe(true);
  });

  it("written .mdc has description frontmatter and skill body", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: tmp
    });

    const parsed = matter(readFileSync(target, "utf8"));
    expect(parsed.data.description).toBe("Does the thing");
    expect(parsed.data.alwaysApply).toBeUndefined();
    expect(parsed.content).toContain("# Body");
    expect(parsed.content).toContain("Rules go here.");
  });

  it("uninstall removes the .mdc file", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: tmp
    });

    await agent.uninstall(target);
    expect(existsSync(target)).toBe(false);
  });

  it("rejects scope=global", async () => {
    const skill = buildSkill(tmp);
    await expect(
      agent.install(skill, { scope: "global", method: "copy", projectDir: tmp })
    ).rejects.toThrow(/project scope/i);
  });
});
