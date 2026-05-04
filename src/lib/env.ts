import * as fs from "fs";
import * as path from "path";

const DOTENV_PATH = path.join(__dirname, "../../.env");

interface Env {
  GROQ_API_KEY: string | undefined;
}

export function loadEnv(): Env {
  if (fs.existsSync(DOTENV_PATH)) {
    const content = fs.readFileSync(DOTENV_PATH, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, "");

      if (key === "GROQ_API_KEY") {
        process.env.GROQ_API_KEY = value;
      }
    }
  }

  return {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  };
}