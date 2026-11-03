import words from "@/data/yoruba-words.json";
import { type DictionaryEntry } from "@/types/dictionary";

const dictionary: DictionaryEntry[] = words;

export function normalizeYorubaWord(word: string): string {
  return word
    .toLocaleLowerCase("yo-NG")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ẹ/g, "e")
    .replace(/ọ/g, "o")
    .replace(/ṣ/g, "s")
    .normalize("NFC")
    .trim();
}

export function searchDictionary(query: string): DictionaryEntry[] {
  const normalizedQuery = normalizeYorubaWord(query);

  if (!normalizedQuery) return [];

  return dictionary.filter((entry) => {
    const normalizedWord = normalizeYorubaWord(entry.word);

    const normalizedMeaning = normalizeYorubaWord(entry.meanings.en);

    return (
      normalizedWord.includes(normalizedQuery) ||
      normalizedMeaning.includes(normalizedQuery)
    );
  });
}
