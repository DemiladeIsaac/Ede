export type LanguageCode = "en" | "yo" | "ha" | "ig";

export interface TranslationPayload {
  text: string;
  source: LanguageCode;
  target: LanguageCode;
}

export interface TranslationResponse {
  text: string;
  source: LanguageCode;
  target: LanguageCode;
  model: string;
  characters: number;
  originalText?: string;
  restoredText?: string;
}

export interface SpeechPayload {
  input: string;
  language: LanguageCode;
  voice?: string;
  response_format?: "mp3" | "wav" | "opus" | "flac";
}
