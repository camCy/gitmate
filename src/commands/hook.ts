import { Command } from "commander";
import chalk from "chalk";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const HOOKS_DIR = path.join(__dirname, "../../hooks");
const HOOK_CONTENT = `#!/bin/sh
node "$(dirname "$0")/../dist/cli.js" generate --hook
`;

export function makeHookCommand(): Command {
  const cmd = new Command("hook");
  cmd.description("Instala o desinstala el git hook de prepare-commit-msg");

  cmd
    .command("install")
    .description("Instala el hook prepare-commit-msg")
    .action(() => installHook());

  cmd
    .command("uninstall")
    .description("Desinstala el hook y restaura hooks por defecto")
    .action(() => uninstallHook());

  cmd
    .command("status")
    .description("Muestra si el hook está instalado")
    .action(() => checkStatus());

  return cmd;
}

function getHooksPath(): string {
  try {
    return execSync("git config core.hooksPath", { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function installHook(): void {
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }

  const hookPath = path.join(HOOKS_DIR, "prepare-commit-msg");
  fs.writeFileSync(hookPath, HOOK_CONTENT, { mode: 0o755 });

  try {
    execSync(`git config core.hooksPath "${HOOKS_DIR}"`, { stdio: "pipe" });
    console.log(chalk.green("✓ Hook instalado correctamente."));
    console.log(chalk.gray(`  Directory: ${HOOKS_DIR}`));
  } catch {
    console.error(chalk.red("Error al instalar el hook."));
    process.exit(1);
  }
}

function uninstallHook(): void {
  const defaultHooksPath = path.join(process.cwd(), ".git/hooks");

  try {
    execSync(`git config core.hooksPath "${defaultHooksPath}"`, { stdio: "pipe" });
    console.log(chalk.green("✓ Hook desinstalado."));
    console.log(chalk.gray(`  Restaurado a: ${defaultHooksPath}`));
  } catch {
    console.error(chalk.red("Error al desinstalar el hook."));
    process.exit(1);
  }
}

function checkStatus(): void {
  const currentPath = getHooksPath();

  if (currentPath === HOOKS_DIR) {
    console.log(chalk.green("✓ Hook instalado: ") + chalk.gray(currentPath));
  } else if (currentPath) {
    console.log(chalk.yellow("⚠ Hook de otro tool activo: ") + chalk.gray(currentPath));
  } else {
    console.log(chalk.red("✗ Hook no instalado (usando default)"));
  }
}