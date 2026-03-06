import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1/voice",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const initiateCall = (phoneNumber: string) =>
  API.post("/call", { phoneNumber });

export const listTranscripts = (page = 1, limit = 20) =>
  API.get(`/transcripts?page=${page}&limit=${limit}`);

export const getTranscript = (callId: string) =>
  API.get(`/transcripts/${callId}`);
