import { execSync } from "child_process";
import chalk from "chalk";

export function getStagedDiff(): string {
  try {
    const diff = execSync("git diff --cached", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return diff;
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 128) {
      console.error(chalk.red("Error: No es un repositorio git o no hay commit inicial."));
      process.exit(1);
    }
    throw error;
  }
}

export function hasStagedChanges(): boolean {
  try {
    const diff = execSync("git diff --cached --stat", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return diff.trim().length > 0;
  } catch {
    return false;
  }
}