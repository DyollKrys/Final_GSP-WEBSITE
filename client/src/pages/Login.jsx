import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiBase";
import PublicLayout from "../layouts/PublicLayout";
import { setAuth } from "../utils/auth";
import { mergeGuestCartIntoUserAfterLogin } from "../utils/cart";
import { httpErrorMessage } from "../utils/httpErrorMessage";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.registered) {
      setInfo("Account created. You can sign in now.");
      const from = location.state?.from;
      navigate(location.pathname, {
        replace: true,
        state: typeof from === "string" ? { from } : {},
      });
    }
  }, [location, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login.php`, {
        email: email.trim(),
        password,
      });
      let data = res.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data.trim());
        } catch {
          setError("Unexpected server response. Try again or contact support.");
          return;
        }
      }
      const u = data?.user;
      const tok = data?.token != null ? String(data.token) : "";
      if (!u || typeof u !== "object" || tok === "") {
        setError("Unexpected server response. Try again or contact support.");
        return;
      }
      setAuth(u, tok);
      try {
        mergeGuestCartIntoUserAfterLogin(u?.id);
      } catch {
        /* cart merge must not block sign-in */
      }
      const rawFrom = location.state?.from;
      const dest =
        typeof rawFrom === "string" &&
        rawFrom.startsWith("/") &&
        !rawFrom.startsWith("//")
          ? rawFrom
          : "/";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(httpErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-[60vh] px-4 py-16">
        <form
          onSubmit={submit}
          className="border border-gray-200 bg-white shadow-lg p-10 rounded-2xl w-full max-w-md"
        >
          <h1 className="text-2xl mb-6 font-bold text-green-900">Log in</h1>

          {info ? (
            <p className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {info}
            </p>
          ) : null}

          {error ? (
            <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          ) : null}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-800 text-white w-full p-3 rounded-lg font-semibold hover:bg-green-900 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            No account yet?{" "}
            <Link to="/register" className="text-green-900 font-semibold underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </PublicLayout>
  );
}
