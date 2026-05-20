import { ManifestStore } from "../manifest/store.js";
import { allAgents } from "../agents/registry.js";
import { intro, outro, multiselect, isCancel, cancel, log } from "@clack/prompts";

export async function removeCommand(): Promise<void> {
  intro("dotnet-clean-arch remove");

  const store = new ManifestStore();
  const entries = store.read().entries;

  if (entries.length === 0) {
    outro("Nothing to remove — manifest is empty.");
    return;
  }

  const options = entries.map((e, i) => ({
    value: i,
    label: `${e.skill}`,
    hint: `${e.agent} / ${e.scope} → ${e.target}`
  }));

  const chosen = await multiselect({
    message: "Which installs do you want to remove?",
    options,
    initialValues: entries.map((_, i) => i),
    required: true
  });

  if (isCancel(chosen)) {
    cancel("Cancelled.");
    return;
  }

  const indices = chosen as number[];
  const agents = allAgents();
  let removed = 0;

  for (const i of indices) {
    const entry = entries[i]!;
    const agent = agents.find(a => a.id === entry.agent);
    if (!agent) {
      log.warn(`Skipping ${entry.skill}: unknown agent ${entry.agent}`);
      continue;
    }

    await agent.uninstall(entry.target);
    store.remove(e => e.target === entry.target);
    removed++;
  }

  outro(`Removed ${removed} install(s).`);
}
