import { useMutation } from "@tanstack/react-query";
import { generateSpeech } from "@/services/speechService";
import type { SpeechPayload } from "@/types/translation";

export const useSpeech = () => {
  return useMutation({
    mutationFn: (payload: SpeechPayload) => generateSpeech(payload),
  });
};
