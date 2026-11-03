import { Button } from "primereact/button";

interface TranslationResultProps {
  value: string;
  loading?: boolean;
  onSpeak?: () => void;
}

export default function TranslationResult({
  value,
  loading = false,
  onSpeak,
}: TranslationResultProps) {
  const copyTranslation = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      console.error("Unable to copy translation.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Translation</span>

        <span className="text-xs text-gray-400">English / Yorùbá</span>
      </div>

      <div className="min-h-32 whitespace-pre-wrap break-words text-base leading-7 text-gray-700">
        {loading ? (
          <span className="text-gray-400">Translating...</span>
        ) : value ? (
          value
        ) : (
          <span className="text-gray-400">
            Your translation will appear here.
          </span>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
        <Button
          type="button"
          icon="pi pi-volume-up"
          text
          rounded
          severity="secondary"
          tooltip="Listen to pronunciation"
          aria-label="Listen to pronunciation"
          disabled={!value || loading || !onSpeak}
          onClick={onSpeak}
        />

        <Button
          type="button"
          icon="pi pi-copy"
          label="Copy"
          text
          severity="secondary"
          disabled={!value || loading}
          onClick={copyTranslation}
        />
      </div>
    </div>
  );
}
