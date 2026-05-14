/** Site account (users table): localStorage + same-tab auth updates for Navbar. */

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u && typeof u === "object" ? u : null;
  } catch {
    return null;
  }
}

export function setAuth(user, token) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("gsp-auth-change"));
}

export function clearAuth() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("gsp-auth-change"));
}

/** True when the stored account role string contains "admin" (case-insensitive). */
export function userHasAdminRole(user) {
  if (!user || user.role == null) return false;
  return String(user.role).toLowerCase().includes("admin");
}
