import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import matter from "gray-matter";
import { CopilotAgent } from "../../src/agents/copilot.js";
import { createTmpDir, removeTmpDir } from "../helpers/tmp-dir.js";
import type { Skill } from "../../src/skills/types.js";

function buildSkill(tmp: string): Skill {
  const dir = join(tmp, "src", "01-x");
  mkdirSync(dir, { recursive: true });
  return {
    id: "01-x",
    name: "my-skill",
    description: "Does the thing",
    sourceDir: dir,
    body: "# Body\n\nUse DDD patterns."
  };
}

describe("CopilotAgent", () => {
  let tmp: string;
  let agent: CopilotAgent;

  beforeEach(() => {
    tmp = createTmpDir();
    agent = new CopilotAgent();
  });
  afterEach(() => removeTmpDir(tmp));

  it("only supports project scope", () => {
    expect(agent.supportedScopes).toEqual(["project"]);
  });

  it("detect returns true when project has .github/", () => {
    mkdirSync(join(tmp, ".github"), { recursive: true });
    expect(agent.detect(tmp)).toBe(true);
  });

  it("install writes .github/instructions/<name>.instructions.md", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: tmp
    });

    expect(target).toBe(join(tmp, ".github", "instructions", "my-skill.instructions.md"));
    expect(existsSync(target)).toBe(true);
  });

  it("written file has applyTo frontmatter targeting C#/.NET files", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: tmp
    });

    const parsed = matter(readFileSync(target, "utf8"));
    expect(parsed.data.applyTo).toBe("**/*.cs,**/*.csproj,**/*.sln");
    expect(parsed.content).toContain("# Body");
    expect(parsed.content).toContain("Use DDD patterns.");
  });

  it("description appears as a leading sentence above the body", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: tmp
    });
    const parsed = matter(readFileSync(target, "utf8"));
    expect(parsed.content.startsWith("> Does the thing")).toBe(true);
  });

  it("uninstall removes the .instructions.md file", async () => {
    const skill = buildSkill(tmp);
    const { target } = await agent.install(skill, {
      scope: "project", method: "copy", projectDir: tmp
    });

    await agent.uninstall(target);
    expect(existsSync(target)).toBe(false);
  });
});
