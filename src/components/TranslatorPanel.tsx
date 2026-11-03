import { useEffect, useRef, useState } from "react";
import { useSpeech } from "@/hooks/useSpeech";
import { Button } from "primereact/button";
import TranslatorInput, { type Language } from "@/components/TranslatorInput";
import TranslationResult from "@/components/TranslationResult";
import { useTranslation } from "@/hooks/useTranslation";

export default function TranslatorPanel() {
  const [sourceLanguage, setSourceLanguage] = useState<Language>("yo");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [restoredInput, setRestoredInput] = useState("");

  const [audioUrl, setAudioUrl] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    mutate: generateAudio,
    isPending: isGeneratingAudio,
    isError: isAudioError,
  } = useSpeech();

  const targetLanguage: Language = sourceLanguage === "yo" ? "en" : "yo";

  const {
    mutate: translate,
    isPending: loading,
    isError,
    error,
    reset,
  } = useTranslation();

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setSourceText(translatedText);
    setTranslatedText("");
    reset();
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) return;

    setTranslatedText("");
    reset();

    translate(
      {
        text: sourceText.trim(),
        source: sourceLanguage,
        target: targetLanguage,
      },
      {
        onSuccess: (response) => {
          setTranslatedText(response.text);
          setRestoredInput(response.restoredText ?? "");
        },
        onError: (error) => {
          console.error("Translation failed:", error);
        },
      },
    );
  };

  const speakTranslation = () => {
    if (!translatedText.trim()) return;

    generateAudio(
      {
        input: translatedText,
        language: targetLanguage,
        response_format: "mp3",
      },
      {
        onSuccess: (audioBlob) => {
          setAudioUrl(URL.createObjectURL(audioBlob));
        },
        onError: (error) => {
          console.error("Audio generation failed:", error);
        },
      },
    );
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Translate with Èdè
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          Translate between Yorùbá and English.
        </p>
      </div>

      <div className="mb-5 flex items-center justify-center gap-3">
        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            sourceLanguage === "yo"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {sourceLanguage === "yo" ? "Yorùbá" : "English"}
        </span>

        <Button
          type="button"
          icon="pi pi-arrow-right-arrow-left"
          rounded
          outlined
          severity="secondary"
          aria-label="Swap languages"
          onClick={swapLanguages}
        />

        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            targetLanguage === "yo"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {targetLanguage === "yo" ? "Yorùbá" : "English"}
        </span>
      </div>

      <div className="space-y-4">
        <TranslatorInput
          language={sourceLanguage}
          value={sourceText}
          onChange={setSourceText}
          onSwap={swapLanguages}
          onTranslate={handleTranslate}
          loading={loading}
        />

        {isError && (
          <p className="text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "Translation failed. Please try again."}
          </p>
        )}

        {restoredInput && (
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-xs font-medium text-gray-500">
              Yoruba text interpretation
            </p>

            <p className="text-sm font-medium text-gray-900">{restoredInput}</p>
          </div>
        )}

        <TranslationResult
          value={translatedText}
          loading={loading}
          onSpeak={speakTranslation}
        />

        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />
        )}

        {isGeneratingAudio && (
          <p className="text-sm text-gray-500">Generating audio...</p>
        )}

        {isAudioError && (
          <p className="text-sm text-red-500">
            Could not generate audio. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
