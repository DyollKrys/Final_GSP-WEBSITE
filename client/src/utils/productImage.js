import { UPLOADS_BASE_URL } from "../config/apiBase";

export function productImageSrc(item) {
  if (!item?.image || item.image === "na") return null;
  const s = String(item.image).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  return `${UPLOADS_BASE_URL}/${s}`;
}
