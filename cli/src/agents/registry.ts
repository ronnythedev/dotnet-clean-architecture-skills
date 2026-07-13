import type { Agent } from "./types.js";
import { ClaudeCodeAgent } from "./claude-code.js";
import { CodexAgent } from "./codex.js";
import { CursorAgent } from "./cursor.js";
import { CopilotAgent } from "./copilot.js";

export function allAgents(): Agent[] {
  return [
    new ClaudeCodeAgent(),
    new CodexAgent(),
    new CursorAgent(),
    new CopilotAgent()
  ];
}

export function detectAgents(projectDir: string): Agent[] {
  return allAgents().filter(a => a.detect(projectDir));
}
