import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { existsSync, readFileSync, mkdirSync, writeFileSync, lstatSync } from "node:fs";
import { ClaudeCodeAgent } from "../../src/agents/claude-code.js";
import { createTmpDir, removeTmpDir } from "../helpers/tmp-dir.js";
import type { Skill } from "../../src/skills/types.js";

function buildSkill(tmp: string, name = "test-skill"): Skill {
  const dir = join(tmp, "src", name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "SKILL.md"), `---\nname: ${name}\ndescription: "x"\n---\n\nbody`, "utf8");
  writeFileSync(join(dir, "extra.md"), "extra content", "utf8");
  return { id: `01-${name}`, name, description: "x", sourceDir: dir, body: "body" };
}

describe("ClaudeCodeAgent", () => {
  let tmp: string;
  let agent: ClaudeCodeAgent;

  beforeEach(() => {
    tmp = createTmpDir();
    agent = new ClaudeCodeAgent(join(tmp, "home"));
  });
  afterEach(() => removeTmpDir(tmp));

  it("supports both global and project scope", () => {
    expect(agent.supportedScopes).toContain("global");
    expect(agent.supportedScopes).toContain("project");
  });

  it("detect returns true when ~/.claude exists (global)", () => {
    mkdirSync(join(tmp, "home", ".claude"), { recursive: true });
    expect(agent.detect(tmp)).toBe(true);
  });

  it("detect returns true when project has .claude/", () => {
    mkdirSync(join(tmp, "proj", ".claude"), { recursive: true });
    expect(agent.detect(join(tmp, "proj"))).toBe(true);
  });

  it("install copies skill folder to ~/.claude/skills/<id> (global, copy)", async () => {
    const skill = buildSkill(tmp);
    const result = await agent.install(skill, {
      scope: "global", method: "copy", projectDir: tmp
    });

    const expected = join(tmp, "home", ".claude", "skills", "01-test-skill");
    expect(result.target).toBe(expected);
    expect(existsSync(join(expected, "SKILL.md"))).toBe(true);
    expect(readFileSync(join(expected, "extra.md"), "utf8")).toBe("extra content");
  });

  it("install symlinks when method=symlink (non-Windows)", async () => {
    if (process.platform === "win32") return;
    const skill = buildSkill(tmp);
    const result = await agent.install(skill, {
      scope: "global", method: "symlink", projectDir: tmp
    });
    expect(lstatSync(result.target).isSymbolicLink()).toBe(true);
  });

  it("install writes to <project>/.claude/skills/ when scope=project", async () => {
    const proj = join(tmp, "proj");
    mkdirSync(proj, { recursive: true });
    const skill = buildSkill(tmp);

    const result = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: proj
    });

    expect(result.target).toBe(join(proj, ".claude", "skills", "01-test-skill"));
  });

  it("uninstall removes a previously-installed skill", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "global", method: "copy", projectDir: tmp
    });

    await agent.uninstall(target);
    expect(existsSync(target)).toBe(false);
  });
});
