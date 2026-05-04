export interface CommitMessage {
  title: string;
  body: string[];
}

export interface LlmOptions {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateOptions {
  diff: string;
  llm: LlmOptions;
}

export interface HookOptions {
  install: boolean;
  uninstall: boolean;
}