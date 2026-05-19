import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export function createTmpDir(prefix = "dotnet-clean-arch-test-"): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

export function removeTmpDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

export interface FixtureSkill {
  folder: string;
  name: string;
  description: string;
  body?: string;
}

export function writeFixtureSkills(root: string, skills: FixtureSkill[]): void {
  for (const s of skills) {
    const dir = join(root, s.folder);
    mkdirSync(dir, { recursive: true });
    const fm = `---\nname: ${s.name}\ndescription: "${s.description}"\n---\n\n${s.body ?? "# " + s.name}\n`;
    writeFileSync(join(dir, "SKILL.md"), fm, "utf8");
  }
}
