import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type { Agent, InstallOptions, InstallResult, Scope } from "./types.js";
import type { Skill } from "../skills/types.js";
import { copyDir, symlinkOrCopyDir, removeIfOurs } from "../utils/fs.js";

export class ClaudeCodeAgent implements Agent {
  readonly id = "claude-code";
  readonly displayName = "Claude Code";
  readonly supportedScopes: readonly Scope[] = ["global", "project"];

  /** Override homedir for testing. */
  constructor(private readonly home: string = homedir()) {}

  detect(projectDir: string): boolean {
    return existsSync(join(this.home, ".claude")) ||
           existsSync(join(projectDir, ".claude"));
  }

  async install(skill: Skill, opts: InstallOptions): Promise<InstallResult> {
    const root = opts.scope === "global"
      ? join(this.home, ".claude", "skills")
      : join(opts.projectDir, ".claude", "skills");

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
