import naijaSpeechClient from "./naijaSpeechClient";
import langaClient from "./langaClient";
import type { SpeechPayload } from "@/types/translation";

export const generateSpeech = async (payload: SpeechPayload): Promise<Blob> => {
  try {
    // Primary: Langa Speech
    const { data } = await langaClient.post<Blob>(
      "/audio/speech",
      {
        input: payload.input,
        voice: payload.language,
        response_format: "mp3",
      },
      {
        responseType: "blob",
      },
    );

    return data;
  } catch (langaError) {
    console.warn("Langa TTS failed. Switching to Naija.");

    try {
      const { data } = await naijaSpeechClient.post<Blob>(
        "/audio/speech",
        {
          input: payload.input,
          language: payload.language,
          response_format: "mp3",
        },
        {
          responseType: "blob",
        },
      );

      return data;
      // Backup: Langa
    } catch (naijaError) {
      console.error("Both speech services failed.", {
        naijaError,
        langaError,
      });

      throw new Error(
        "Audio generation is currently unavailable. Please try again later.",
      );
    }
  }
};
