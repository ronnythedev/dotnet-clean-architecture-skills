import { describe, it, expect } from "vitest";
import { allAgents } from "../../src/agents/registry.js";

describe("agent registry", () => {
  it("includes Codex in the installer agent list", () => {
    const codex = allAgents().find(agent => agent.id === "codex");

    expect(codex?.displayName).toBe("Codex");
    expect(codex?.supportedScopes).toEqual(["global", "project"]);
  });
});
