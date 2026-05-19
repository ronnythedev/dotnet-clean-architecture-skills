import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "src/cli.ts" },
  format: ["cjs"],
  target: "node20",
  outDir: "dist",
  clean: false,
  shims: true,
  banner: { js: "#!/usr/bin/env node" },
  noExternal: ["@clack/prompts", "commander", "gray-matter"]
});
