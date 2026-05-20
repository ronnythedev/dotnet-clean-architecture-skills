import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "..", "..", "skills");
const dst = resolve(here, "..", "dist", "skills");

if (!existsSync(src)) {
  console.error(`error: source ${src} does not exist`);
  process.exit(1);
}

if (existsSync(dst)) rmSync(dst, { recursive: true, force: true });
mkdirSync(dst, { recursive: true });

cpSync(src, dst, {
  recursive: true,
  filter: (s) => !/\.DS_Store$/.test(s)
});

console.log(`bundled skills: ${src} -> ${dst}`);
