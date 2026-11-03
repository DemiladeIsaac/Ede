import axios from "axios";

const langaClient = axios.create({
  baseURL: import.meta.env.VITE_LANGA_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_LANGA_API_KEY}`,
  },
});

export default langaClient;
