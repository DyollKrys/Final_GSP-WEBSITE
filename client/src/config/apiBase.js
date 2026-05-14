const explicitApi = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const SERVER_BASE = (
  import.meta.env.VITE_SERVER_BASE_URL || ""
).replace(/\/$/, "") ||
  (explicitApi ? explicitApi.replace(/\/api$/, "") : "") ||
  "http://localhost/Final_GSP-WEBSITE-main/server";

export const API_BASE_URL = explicitApi || `${SERVER_BASE}/api`;
export const UPLOADS_BASE_URL = `${SERVER_BASE}/uploads`;
