import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { loadSkillsFrom } from "../skills/loader.js";
import { allAgents, detectAgents } from "../agents/registry.js";
import { ManifestStore } from "../manifest/store.js";
import {
  startTui, endTui, fail,
  chooseAgents, chooseSkills, chooseScope, chooseMethod, confirmPlan
} from "../tui/prompts.js";
import { log } from "@clack/prompts";

export async function addCommand(cwd: string = process.cwd()): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url));
  const bundledSkills = join(here, "skills");
  const skills = loadSkillsFrom(bundledSkills);

  if (skills.length === 0) {
    fail(`No skills bundled in ${bundledSkills}. The package build may be broken.`);
  }

  startTui("dotnet-clean-arch installer");

  const all = allAgents();
  const detected = detectAgents(cwd);

  if (detected.length > 0) {
    log.info(`Detected: ${detected.map(a => a.displayName).join(", ")}`);
  }

  const chosenAgents = await chooseAgents(all, detected);
  const chosenSkills = await chooseSkills(skills);
  const method = await chooseMethod();

  const store = new ManifestStore();
  const installs: { agent: string; skill: string; target: string }[] = [];

  for (const agent of chosenAgents) {
    const scope = await chooseScope(agent.supportedScopes);

    const summary = [
      `Installing ${chosenSkills.length} skills into ${agent.displayName}`,
      `  scope:  ${scope}`,
      `  method: ${method}`
    ].join("\n");

    const ok = await confirmPlan(summary);
    if (!ok) continue;

    for (const skill of chosenSkills) {
      const result = await agent.install(skill, {
        scope,
        method,
        projectDir: resolve(cwd)
      });
      store.append({
        v: 1,
        installedAt: new Date().toISOString(),
        skill: skill.name,
        agent: agent.id,
        scope,
        method,
        target: result.target
      });
      installs.push({ agent: agent.id, skill: skill.name, target: result.target });
    }
  }

  endTui(`Installed ${installs.length} skill(s). Run \`npx dotnet-clean-arch remove\` to reverse.`);
}
