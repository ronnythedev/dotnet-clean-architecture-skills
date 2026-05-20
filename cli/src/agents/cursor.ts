import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import matter from "gray-matter";
import type { Agent, InstallOptions, InstallResult, Scope } from "./types.js";
import type { Skill } from "../skills/types.js";
import { removeIfOurs } from "../utils/fs.js";

export class CursorAgent implements Agent {
  readonly id = "cursor";
  readonly displayName = "Cursor";
  readonly supportedScopes: readonly Scope[] = ["project"];

  detect(projectDir: string): boolean {
    return existsSync(join(projectDir, ".cursor"));
  }

  async install(skill: Skill, opts: InstallOptions): Promise<InstallResult> {
    if (opts.scope !== "project") {
      throw new Error(`Cursor only supports project scope, got: ${opts.scope}`);
    }

    const rulesDir = join(opts.projectDir, ".cursor", "rules");
    const target = join(rulesDir, `${skill.id}.mdc`);

    mkdirSync(rulesDir, { recursive: true });

    const content = matter.stringify(skill.body, {
      description: skill.description
    });

    writeFileSync(target, content, "utf8");

    return { target, displayName: `${this.displayName}: ${skill.name}` };
  }

  async uninstall(target: string): Promise<void> {
    removeIfOurs(target, dirname(target));
  }
}
