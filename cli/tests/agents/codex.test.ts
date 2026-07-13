import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { existsSync, readFileSync, mkdirSync, writeFileSync, lstatSync } from "node:fs";
import { CodexAgent } from "../../src/agents/codex.js";
import { createTmpDir, removeTmpDir } from "../helpers/tmp-dir.js";
import type { Skill } from "../../src/skills/types.js";

function buildSkill(tmp: string, name = "test-skill"): Skill {
  const dir = join(tmp, "src", name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "SKILL.md"), `---\nname: ${name}\ndescription: "x"\n---\n\nbody`, "utf8");
  writeFileSync(join(dir, "extra.md"), "extra content", "utf8");
  return { id: `01-${name}`, name, description: "x", sourceDir: dir, body: "body" };
}

describe("CodexAgent", () => {
  let tmp: string;
  let agent: CodexAgent;

  beforeEach(() => {
    tmp = createTmpDir();
    agent = new CodexAgent(join(tmp, "home"));
  });
  afterEach(() => removeTmpDir(tmp));

  it("supports both global and project scope", () => {
    expect(agent.supportedScopes).toEqual(["global", "project"]);
  });

  it("detects a global Codex installation", () => {
    mkdirSync(join(tmp, "home", ".codex"), { recursive: true });
    expect(agent.detect(tmp)).toBe(true);
  });

  it("detects a global agent configuration", () => {
    mkdirSync(join(tmp, "home", ".agents"), { recursive: true });
    expect(agent.detect(tmp)).toBe(true);
  });

  it("detects repository-scoped agent configuration", () => {
    mkdirSync(join(tmp, "project", ".agents"), { recursive: true });
    expect(agent.detect(join(tmp, "project"))).toBe(true);
  });

  it("detects repository-scoped Codex configuration", () => {
    mkdirSync(join(tmp, "project", ".codex"), { recursive: true });
    expect(agent.detect(join(tmp, "project"))).toBe(true);
  });

  it("copies a global skill to ~/.agents/skills/<id>", async () => {
    const skill = buildSkill(tmp);
    const result = await agent.install(skill, {
      scope: "global", method: "copy", projectDir: tmp
    });

    const expected = join(tmp, "home", ".agents", "skills", "01-test-skill");
    expect(result.target).toBe(expected);
    expect(existsSync(join(expected, "SKILL.md"))).toBe(true);
    expect(readFileSync(join(expected, "extra.md"), "utf8")).toBe("extra content");
  });

  it("symlinks a global skill when requested", async () => {
    if (process.platform === "win32") return;
    const skill = buildSkill(tmp);
    const result = await agent.install(skill, {
      scope: "global", method: "symlink", projectDir: tmp
    });
    expect(lstatSync(result.target).isSymbolicLink()).toBe(true);
  });

  it("copies a project skill to <project>/.agents/skills/<id>", async () => {
    const project = join(tmp, "project");
    mkdirSync(project, { recursive: true });
    const skill = buildSkill(tmp);

    const result = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: project
    });

    expect(result.target).toBe(join(project, ".agents", "skills", "01-test-skill"));
  });

  it("uninstalls a previously installed skill", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "global", method: "copy", projectDir: tmp
    });

    await agent.uninstall(target);
    expect(existsSync(target)).toBe(false);
  });
});
