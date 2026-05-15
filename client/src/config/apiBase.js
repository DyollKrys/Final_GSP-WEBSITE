const explicitApi = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const LOCAL_DEFAULT = "http://localhost/Final_GSP-WEBSITE-main/server";

/**
 * In a production build opened in the browser, point at the PHP API on the same
 * host as the page (so phones / other PCs work). Falls back when opened from file://.
 * Dev server still uses LOCAL_DEFAULT so Vite on :5173 talks to XAMPP.
 */
function inferServerBaseFromPage() {
  if (typeof window === "undefined") return null;
  const { origin, pathname } = window.location;
  if (!origin || origin === "null") return null;

  const viteBase = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  if (/\/client\/dist$/i.test(viteBase)) {
    return `${origin}${viteBase.replace(/\/client\/dist$/i, "/server")}`;
  }

  const marker = "/Final_GSP-WEBSITE-main";
  if (pathname.includes(marker)) {
    return `${origin}${marker}/server`;
  }

  return `${origin}/server`;
}

const SERVER_BASE = (
  import.meta.env.VITE_SERVER_BASE_URL || ""
).replace(/\/$/, "") ||
  (explicitApi ? explicitApi.replace(/\/api$/, "") : "") ||
  (import.meta.env.DEV
    ? LOCAL_DEFAULT
    : inferServerBaseFromPage() || LOCAL_DEFAULT);

export const API_BASE_URL = explicitApi || `${SERVER_BASE}/api`;
export const UPLOADS_BASE_URL = `${SERVER_BASE}/uploads`;
