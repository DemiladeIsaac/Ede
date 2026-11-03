import { useMutation } from "@tanstack/react-query";
import { translateText } from "@/services/translationService";
import type { TranslationPayload } from "@/types/translation";

export const useTranslation = () => {
  return useMutation({
    mutationFn: (payload: TranslationPayload) => translateText(payload),
  });
};
