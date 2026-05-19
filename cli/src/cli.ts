import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadSkillsFrom } from "./skills/loader.js";

const here = dirname(fileURLToPath(import.meta.url));
const skillsDir = join(here, "..", "..", "skills");
const skills = loadSkillsFrom(skillsDir);

console.log(`Found ${skills.length} skills:`);
for (const s of skills) {
  console.log(`  ${s.id.padEnd(40)} ${s.name}`);
}
