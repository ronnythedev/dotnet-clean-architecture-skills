import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Agent, InstallOptions, InstallResult, Scope } from "./types.js";
import type { Skill } from "../skills/types.js";
import { copyDir, symlinkOrCopyDir, removeIfOurs } from "../utils/fs.js";

export class CodexAgent implements Agent {
  readonly id = "codex";
  readonly displayName = "Codex";
  readonly supportedScopes: readonly Scope[] = ["global", "project"];

  /** Override homedir for testing. */
  constructor(private readonly home: string = homedir()) {}

  detect(projectDir: string): boolean {
    return existsSync(join(this.home, ".codex")) ||
           existsSync(join(this.home, ".agents")) ||
           existsSync(join(projectDir, ".agents")) ||
           existsSync(join(projectDir, ".codex"));
  }

  async install(skill: Skill, opts: InstallOptions): Promise<InstallResult> {
    const root = opts.scope === "global"
      ? join(this.home, ".agents", "skills")
      : join(opts.projectDir, ".agents", "skills");

    const target = join(root, skill.id);

    if (opts.method === "symlink") {
      symlinkOrCopyDir(skill.sourceDir, target);
    } else {
      copyDir(skill.sourceDir, target);
    }

    return { target, displayName: `${this.displayName} (${opts.scope}): ${skill.name}` };
  }

  async uninstall(target: string): Promise<void> {
    const expectedRoot = join(target, "..");
    removeIfOurs(target, expectedRoot);
  }
}
