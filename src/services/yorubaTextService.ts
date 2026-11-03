import axios from "axios";
import { normalizeYorubaText } from "@/utils/yorubaText";

const yorubaTextClient = axios.create({
  baseURL: import.meta.env.VITE_YORUBA_TEXT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RestoreYorubaResponse {
  originalText: string;
  normalizedText: string;
  restoredText: string;
  changed: boolean;
}

export const restoreYorubaText = async (
  text: string,
): Promise<RestoreYorubaResponse> => {
  const normalizedText = normalizeYorubaText(text);

  const { data } = await yorubaTextClient.post<RestoreYorubaResponse>(
    "/api/yoruba/restore",
    {
      text: normalizedText,
    },
  );

  return data;
};
