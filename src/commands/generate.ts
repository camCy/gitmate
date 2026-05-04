import { Command } from "commander";
import chalk from "chalk";
import { getStagedDiff, hasStagedChanges, generateCommitMessage, parseCommitMessage } from "../lib";
import { loadEnv } from "../lib/env";

export function makeGenerateCommand(): Command {
  const cmd = new Command("generate");
  cmd.description("Genera un mensaje de commit usando IA");

  cmd.option("-m, --model <model>", "Modelo Groq a usar", "llama-3.3-70b-versatile");
  cmd.option("-t, --max-tokens <number>", "Máximo de tokens en respuesta", "300");
  cmd.option("--temperature <number>", "Temperatura del modelo (0-1)", "0.3");
  cmd.option("--hook", "Modo hook: escribe en archivo de mensaje en lugar de stdout", false);

  cmd.action(async (opts) => {
    const env = loadEnv();

    if (!env.GROQ_API_KEY) {
      console.error(chalk.red("Error: GROQ_API_KEY no está configurada."));
      console.error(chalk.yellow("Crea un archivo .env con tu API key de Groq."));
      process.exit(1);
    }

    if (!hasStagedChanges()) {
      console.error(chalk.red("Error: No hay cambios en staging."));
      console.error(chalk.yellow("Usa 'git add' para agregar archivos antes de generar el mensaje."));
      process.exit(1);
    }

    const diff = getStagedDiff();

    try {
      const raw = await generateCommitMessage(diff, {
        apiKey: env.GROQ_API_KEY,
        model: opts.model,
        maxTokens: parseInt(opts.maxTokens, 10),
        temperature: parseFloat(opts.temperature),
      });

      const parsed = parseCommitMessage(raw);
      const message = [parsed.title, "", ...parsed.body].join("\n") + "\n";

      if (opts.hook) {
        const argvIdx = process.argv.findIndex((a) => a === "--hook");
        const msgFile = argvIdx !== -1 ? process.argv[argvIdx + 1] : null;
        if (msgFile && !msgFile.startsWith("-")) {
          const fs = await import("fs");
          fs.writeFileSync(msgFile, message);
        } else {
          console.log(message);
        }
      } else {
        console.log();
        console.log(chalk.green("Mensaje de commit generado:"));
        console.log();
        console.log(chalk.bold(parsed.title));
        if (parsed.body.length > 0) {
          console.log();
          parsed.body.forEach((line) => console.log(`  ${line}`));
        }
      }
    } catch (error) {
      console.error(chalk.red("Error al generar el mensaje:"), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

  return cmd;
}