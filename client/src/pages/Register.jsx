import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiBase";
import PublicLayout from "../layouts/PublicLayout";
import { httpErrorMessage } from "../utils/httpErrorMessage";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/register.php`, {
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", { replace: true, state: { registered: true } });
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
          <h1 className="text-2xl mb-6 font-bold text-green-900">Create account</h1>

          {error ? (
            <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          ) : null}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            type="text"
            autoComplete="name"
            value={form.fullname}
            className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password (min. 8 characters)
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
            minLength={8}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-800 text-white w-full p-3 rounded-lg font-semibold hover:bg-green-900 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-900 font-semibold underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </PublicLayout>
  );
}
