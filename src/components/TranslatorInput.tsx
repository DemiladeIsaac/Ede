import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

export type Language = "yo" | "en";

interface TranslatorInputProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  onSwap: () => void;
  onTranslate: () => void;
  loading?: boolean;
}

const languageLabels: Record<Language, string> = {
  yo: "Yorùbá",
  en: "English",
};

export default function TranslatorInput({
  language,
  value,
  onChange,
  onSwap,
  onTranslate,
  loading = false,
}: TranslatorInputProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-800">
          {languageLabels[language]}
        </span>

        <Button
          type="button"
          icon="pi pi-arrow-right-arrow-left"
          rounded
          text
          severity="secondary"
          aria-label="Swap languages"
          tooltip="Swap languages"
          onClick={onSwap}
        />
      </div>

      <InputTextarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          language === "yo"
            ? "Tẹ ọrọ Yorùbá síbí..."
            : "Enter English text here..."
        }
        rows={5}
        autoResize
        maxLength={5000}
        className="w-full resize-none border-0 p-0 text-base leading-7 shadow-none focus:shadow-none focus:ring-0"
        aria-label={`Text to translate in ${languageLabels[language]}`}
      />

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">{value.length}/5000</span>

        <Button
          type="button"
          label="Translate"
          icon="pi pi-language"
          loading={loading}
          disabled={!value.trim() || loading}
          onClick={onTranslate}
          className="rounded-lg px-4 py-2"
        />
      </div>
    </div>
  );
}
