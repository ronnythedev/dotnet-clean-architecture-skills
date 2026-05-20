import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("dotnet-clean-arch")
  .description(".NET Clean Architecture skills installer for Claude Code, Cursor, and GitHub Copilot")
  .version("0.1.0");

program
  .command("add", { isDefault: true })
  .description("Interactively install skills into your AI agent(s)")
  .action(async () => { await addCommand(); });

program
  .command("remove")
  .description("Reverse previous installs from the manifest")
  .action(async () => { await removeCommand(); });

program
  .command("list")
  .description("List available skills and agents")
  .action(() => { listCommand(); });

program.parseAsync().catch(err => {
  console.error(err);
  process.exit(1);
});
