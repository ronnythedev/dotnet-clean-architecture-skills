import type { Skill } from "../skills/types.js";

export type Scope = "global" | "project";
export type InstallMethod = "copy" | "symlink";

export interface InstallOptions {
  scope: Scope;
  method: InstallMethod;
  /** Project root, defaults to CWD. */
  projectDir: string;
}

export interface InstallResult {
  /** Absolute path to whatever was created (file or directory). */
  target: string;
  /** What the user sees. */
  displayName: string;
}

export interface Agent {
  /** Stable id used internally and in the manifest, e.g. "claude-code" or "codex". */
  id: string;
  /** Human-friendly name shown in TUI, e.g. "Claude Code". */
  displayName: string;
  /** Returns true if this agent appears to be configured in `projectDir` or globally. */
  detect(projectDir: string): boolean;
  /** Scopes this agent supports. Claude Code/Codex: ["global", "project"]. Cursor/Copilot: ["project"]. */
  supportedScopes: readonly Scope[];
  /** Installs a single skill and returns where it landed. */
  install(skill: Skill, opts: InstallOptions): Promise<InstallResult>;
  /** Reverses an install. `target` is the path from InstallResult. */
  uninstall(target: string): Promise<void>;
}
