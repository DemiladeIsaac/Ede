export const normalizeYorubaText = (text: string): string => {
  return text
    .normalize("NFC")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
