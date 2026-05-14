import { UPLOADS_BASE_URL } from "../config/apiBase";

/** Cover: full URL, site-relative `/assets/...`, or uploads filename. */
export function publicationCoverSrc(image) {
  if (!image || image === "na") return null;
  const s = String(image).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return s;
  return `${UPLOADS_BASE_URL}/${s}`;
}

/** Open link: external URL or uploaded file under uploads. */
export function publicationFileHref(file) {
  if (!file || file === "na") return "#";
  const s = String(file).trim();
  if (!s) return "#";
  if (/^https?:\/\//i.test(s)) return s;
  return `${UPLOADS_BASE_URL}/${s}`;
}
