import type {
  TranslationPayload,
  TranslationResponse,
} from "@/types/translation";
import { restoreYorubaText } from "./yorubaTextService";
import { normalizeYorubaText } from "@/utils/yorubaText";
import naijaSpeechClient from "./naijaSpeechClient";
import langaClient from "./langaClient";

// Keep your existing translateWithLanga and
// translateWithNaijaSpeech functions.

interface LangaResponse {
  translation: string;
}

const translateWithNaijaSpeech = async (
  payload: TranslationPayload,
): Promise<TranslationResponse> => {
  const { data } = await naijaSpeechClient.post<TranslationResponse>(
    "/translations",
    payload,
  );

  return data;
};

const translateWithLanga = async (
  payload: TranslationPayload,
): Promise<TranslationResponse> => {
  const { data } = await langaClient.post<LangaResponse>("/translate", {
    text: payload.text,
    source_language: payload.source,
    target_language: payload.target,
  });

  return {
    text: data.translation,
    source: payload.source,
    target: payload.target,
    model: "langa",
    characters: payload.text.length,
  };
};

export const translateText = async (
  payload: TranslationPayload,
): Promise<TranslationResponse> => {
  let preparedText = normalizeYorubaText(payload.text);

  // Restore Yoruba only when Yoruba is the source language.
  if (payload.source === "yo") {
    try {
      const restoration = await restoreYorubaText(preparedText);

      preparedText = restoration.restoredText;

      console.info("Yoruba text restoration:", {
        original: payload.text,
        restored: preparedText,
      });
    } catch (error) {
      // Don't prevent translation if the restoration service is unavailable.
      console.warn(
        "Yoruba restoration failed. Using normalized input instead.",
        error,
      );
    }
  }

  const preparedPayload = {
    ...payload,
    text: preparedText,
  };

  try {
    const response = await translateWithLanga(preparedPayload);

    return {
      ...response,
      originalText: payload.text,
      restoredText: payload.source === "yo" ? preparedText : undefined,
    };
  } catch (langaError) {
    console.warn("Langa failed. Switching to Naija Speech.");

    try {
      const response = await translateWithNaijaSpeech(preparedPayload);

      return {
        ...response,
        originalText: payload.text,
        restoredText: payload.source === "yo" ? preparedText : undefined,
      };
    } catch (naijaError) {
      console.error("Both translation providers failed.", {
        langaError,
        naijaError,
      });

      throw new Error(
        "Translation is currently unavailable. Please try again later.",
      );
    }
  }
};
