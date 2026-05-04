import { Command } from "commander";
import { makeGenerateCommand } from "./commands/generate";
import { makeHookCommand } from "./commands/hook";
import chalk from "chalk";

const program = new Command();

program
  .name("gitmate")
  .description("Generador de mensajes de commit con IA usando Groq")
  .version("0.1.0");

program.addCommand(makeGenerateCommand());
program.addCommand(makeHookCommand());

program.on("command:*", () => {
  console.error(chalk.red(`Comando no reconocido: ${program.args.join(" ")}`));
  console.error(chalk.yellow("Usa --help para ver los comandos disponibles."));
  process.exit(1);
});

export { program };

program.parse(process.argv);