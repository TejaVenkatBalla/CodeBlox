import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";
import { BACKEND_API_BASE_URL } from "./config";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language, sourceCode, input = "") => {
  const payload = {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  };

  // Only add stdin if input is not empty or just whitespace
  if (input && input.trim() !== "") {
    payload.stdin = input;
  }

  const response = await API.post("/execute", payload);
  return response.data;
};

export const explainErrorAPI = async (code, error, language) => {
  const response = await axios.post(`${BACKEND_API_BASE_URL}/explain-error`, {
    code,
    error,
    language,
  });
  return response.data;
};

export const aiHelperAPI = async (question, language) => {
  const response = await axios.post(`${BACKEND_API_BASE_URL}/ai-helper`, {
    question,
    language,
  });
  return response.data;
};

export const getCodingChallenge = async () => {
  const response = await axios.get(`${BACKEND_API_BASE_URL}/coding-challenge`);
  return response.data;
};
