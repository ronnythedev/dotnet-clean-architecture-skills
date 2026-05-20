import { Command } from "commander";
import { addCommand } from "./commands/add.js";

const program = new Command();

program
  .name("dotnet-clean-arch")
  .description(".NET Clean Architecture skills installer for Claude Code, Cursor, and GitHub Copilot")
  .version("0.1.0");

program
  .command("add", { isDefault: true })
  .description("Interactively install skills into your AI agent(s)")
  .action(async () => {
    await addCommand();
  });

program.parseAsync().catch(err => {
  console.error(err);
  process.exit(1);
});
