import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false,  headers: {
    "ngrok-skip-browser-warning": "true",
  },});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Workflows ──────────────────────────────────────────────
export const getWorkflows = () => API.get("/workflows");
export const createWorkflow = (data: { name: string; nodes: unknown[]; edges: unknown[] }) =>
  API.post("/workflows", data);
export const updateWorkflow = (
  id: string,
  data: { name?: string; nodes?: unknown[]; edges?: unknown[] }
) => API.put(`/workflows/${id}`, data);
export const deleteWorkflow = (id: string) => API.delete(`/workflows/${id}`);
export const getWorkflowById = (id: string) => API.get(`/workflows/${id}`);

// ── Leads ──────────────────────────────────────────────────
export const uploadLeads = (workflowId: string, file: File) => {
  const form = new FormData();
  form.append("file", file);
  form.append("workflowId", workflowId);
  return API.post("/leads/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ── AI ─────────────────────────────────────────────────────
export const generateMessage = (lead: object, instructions: string) =>
  API.post("/ai/generate-message", { lead, instructions });

export const generateWorkflowFromPrompt = (prompt: string) =>
  API.post("/ai/generate-workflow", { prompt });

// ── Engine ─────────────────────────────────────────────────
export const runWorkflow = (workflowId: string) =>
  API.post(`/engine/${workflowId}/execute`);

export const executeWorkflow = (workflowId: string) =>
  API.post(`/engine/${workflowId}/execute`);

export const getWorkflowStatus = (workflowId: string) =>
  API.get(`/engine/${workflowId}/status`);

// ── Analytics ──────────────────────────────────────────────
export const getAnalytics = () => API.get("/analytics");

// ── User Settings (messaging credentials) ──────────────────
export const getSettings = () => API.get("/settings");
export const updateSettings = (data: {
  email?: { host?: string; port?: number; secure?: boolean; user?: string; pass?: string; from?: string };
  slack?: { webhookUrl?: string };
  telegram?: { botToken?: string; chatId?: string };
  vapi?: { apiKey?: string; assistantId?: string; phoneNumberId?: string };
}) => API.put("/settings", data);

// ── Calls / VAPI Transcripts ────────────────────────────────
export const getCallTranscripts = (params?: { workflowId?: string; page?: number; limit?: number }) =>
  API.get("/calls/transcripts", { params });

export const getCallTranscript = (callId: string) =>
  API.get(`/calls/transcripts/${callId}`);

export const syncCallTranscript = (vapiId: string) =>
  API.post(`/calls/sync/${vapiId}`);

export default API;
