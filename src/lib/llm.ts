import Groq from "groq-sdk";

export async function generateCommitMessage(
  diff: string,
  options: {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const {
    apiKey,
    model = "llama-3.3-70b-versatile",
    maxTokens = 300,
    temperature = 0.3,
  } = options;

  const prompt = buildPrompt(diff);

  const groq = new Groq({ apiKey });

  const response = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente que genera mensajes de commit siguiendo las convenciones conventional commits. " +
          "Responde SOLO con el mensaje de commit en el formato especificado, sin explicaciones adicionales.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
    temperature,
  });

  const message = response.choices[0]?.message?.content;
  if (!message) {
    throw new Error("No se recibió respuesta del LLM");
  }

  return message.trim();
}

function buildPrompt(diff: string): string {
  return `Analiza el siguiente diff de git y genera un mensaje de commit en español (tono colombiano).

Formato de salida:
- Primera línea: título corto (máx 72 caracteres), usar prefijo conventional commits si aplica (feat:, fix:, refactor:, docs:, test:, chore:)
- Línea en blanco
- Bullets (usando -) resumiendo los cambios más importantes

Reglas:
- No inventes cambios que no estén en el diff
- Identifica la intención del cambio (feature, fix, refactor, etc.)
- Prioriza el QUÉ cambió y POR QUÉ, no detalles de bajo nivel
- Ignora cambios triviales de formato o whitespace
- Agrupa cambios relacionados en bullets significativos
- Evita repetir nombres de archivo a menos que sea necesario

DIFF:
${diff}

Respuesta:`;
}

export function parseCommitMessage(raw: string): { title: string; body: string[] } {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  if (lines.length === 0) {
    throw new Error("No se pudo parsear el mensaje de commit");
  }

  const title = lines[0];
  const body = lines.slice(1).filter((l) => l.startsWith("-"));

  return { title, body };
}