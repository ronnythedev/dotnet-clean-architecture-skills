import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import matter from "gray-matter";
import type { Agent, InstallOptions, InstallResult, Scope } from "./types.js";
import type { Skill } from "../skills/types.js";
import { removeIfOurs } from "../utils/fs.js";

export class CopilotAgent implements Agent {
  readonly id = "copilot";
  readonly displayName = "GitHub Copilot";
  readonly supportedScopes: readonly Scope[] = ["project"];

  detect(projectDir: string): boolean {
    return existsSync(join(projectDir, ".github"));
  }

  async install(skill: Skill, opts: InstallOptions): Promise<InstallResult> {
    if (opts.scope !== "project") {
      throw new Error(`Copilot only supports project scope, got: ${opts.scope}`);
    }

    const dir = join(opts.projectDir, ".github", "instructions");
    const target = join(dir, `${skill.name}.instructions.md`);

    mkdirSync(dir, { recursive: true });

    const body = `> ${skill.description}\n\n${skill.body}`;
    const content = matter.stringify(body, {
      applyTo: "**/*.cs,**/*.csproj,**/*.sln"
    });

    writeFileSync(target, content, "utf8");

    return { target, displayName: `${this.displayName}: ${skill.name}` };
  }

  async uninstall(target: string): Promise<void> {
    removeIfOurs(target, dirname(target));
  }
}
