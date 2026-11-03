import axios from "axios";

const naijaSpeechClient = axios.create({
  baseURL: import.meta.env.VITE_NAIJA_SPEECH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_NAIJA_ASR_KEY}`,
  },
});

export default naijaSpeechClient;
