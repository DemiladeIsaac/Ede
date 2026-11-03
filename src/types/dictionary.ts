export interface DictionaryEntry {
  id: number;
  word: string;
  normalized: string;
  tokens: string[];
  difficulty: string;
  meanings: {
    en: string;
  };
  partOfSpeech?: string;
  pronunciation?: string;
  examples?: {
    yoruba: string;
    english: string;
  }[];
}
