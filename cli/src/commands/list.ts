import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadSkillsFrom } from "../skills/loader.js";
import { allAgents } from "../agents/registry.js";

export function listCommand(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const skills = loadSkillsFrom(join(here, "skills"));
  const agents = allAgents();

  console.log("Agents:");
  for (const a of agents) {
    console.log(`  ${a.id.padEnd(14)} ${a.displayName} (scopes: ${a.supportedScopes.join(", ")})`);
  }

  console.log(`\nSkills (${skills.length}):`);
  for (const s of skills) {
    console.log(`  ${s.id.padEnd(40)} ${s.name}`);
    console.log(`    ${s.description}`);
  }
}
