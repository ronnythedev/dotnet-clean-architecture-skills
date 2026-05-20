import { intro, outro, multiselect, select, confirm, isCancel, cancel, log } from "@clack/prompts";
import type { Skill } from "../skills/types.js";
import type { Agent, Scope, InstallMethod } from "../agents/types.js";

export function startTui(title: string): void {
  intro(title);
}

export function endTui(message: string): void {
  outro(message);
}

export function fail(message: string): never {
  cancel(message);
  process.exit(1);
}

export async function chooseAgents(all: Agent[], detected: Agent[]): Promise<Agent[]> {
  const options = all.map(a => ({
    value: a.id,
    label: a.displayName + (detected.includes(a) ? "  (detected)" : ""),
    hint: detected.includes(a) ? undefined : "not detected in cwd"
  }));

  const initialValues = detected.some(a => a.id === "claude-code")
    ? ["claude-code"]
    : [];

  const selected = await multiselect({
    message: "Which agents do you want to install into? (Space toggles, Enter confirms)",
    options,
    initialValues,
    required: true
  });

  if (isCancel(selected)) fail("Cancelled.");
  return all.filter(a => (selected as string[]).includes(a.id));
}

export async function chooseSkills(skills: Skill[]): Promise<Skill[]> {
  const options = skills.map(s => ({
    value: s.id,
    label: s.id
  }));

  const selected = await multiselect({
    message: `Which skills do you want to install? (${skills.length} available — Space toggles, Enter confirms)`,
    options,
    initialValues: skills.map(s => s.id),
    required: true
  });

  if (isCancel(selected)) fail("Cancelled.");
  return skills.filter(s => (selected as string[]).includes(s.id));
}

export async function chooseScope(supported: readonly Scope[]): Promise<Scope> {
  if (supported.length === 1) return supported[0]!;

  const choice = await select({
    message: "Install scope?",
    options: [
      { value: "global", label: "Global (~/.claude/skills/)", hint: "available across all projects" },
      { value: "project", label: "Project (./.claude/skills/)", hint: "available only in this repo" }
    ],
    initialValue: "global"
  });

  if (isCancel(choice)) fail("Cancelled.");
  return choice as Scope;
}

export async function chooseMethod(): Promise<InstallMethod> {
  if (process.platform === "win32") {
    log.info("Detected Windows — defaulting to copy (symlinks require Developer Mode).");
    return "copy";
  }

  const choice = await select({
    message: "Install method?",
    options: [
      { value: "copy", label: "Copy", hint: "independent snapshot (recommended)" },
      { value: "symlink", label: "Symlink", hint: "updates with this CLI's source" }
    ],
    initialValue: "copy"
  });

  if (isCancel(choice)) fail("Cancelled.");
  return choice as InstallMethod;
}

export async function confirmPlan(summary: string): Promise<boolean> {
  log.message(summary);
  const yes = await confirm({ message: "Proceed?", initialValue: true });
  if (isCancel(yes)) fail("Cancelled.");
  return yes as boolean;
}
