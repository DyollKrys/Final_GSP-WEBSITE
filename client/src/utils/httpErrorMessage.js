/** User-visible text from axios errors (JSON body or network failures). */
export function httpErrorMessage(err) {
  const data = err?.response?.data;
  const apiMsg = data?.message;
  const detail = data?.detail || data?.hint;
  if (apiMsg && detail) return `${apiMsg} ${detail}`;
  if (apiMsg) return apiMsg;
  if (typeof detail === "string" && detail) return detail;
  if (
    !err?.response &&
    (err?.code === "ERR_NETWORK" || err?.message === "Network Error")
  ) {
    return "Cannot reach the server. The app may still be pointing at localhost: set VITE_API_BASE_URL when you build, or deploy the PHP API on the same host as this page.";
  }
  return err?.message || "Something went wrong. Try again.";
}
