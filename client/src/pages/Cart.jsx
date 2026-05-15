import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PublicLayout from "../layouts/PublicLayout";
import { API_BASE_URL } from "../config/apiBase";
import { getStoredUser } from "../utils/auth";
import {
  getCart,
  clearCart,
  updateCartLineQuantity,
  cartItemCount,
} from "../utils/cart";
import { productImageSrc } from "../utils/productImage";

export default function Cart() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [lines, setLines] = useState(() =>
    user?.id && token ? getCart() : []
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !token) {
      navigate("/login", { replace: true, state: { from: "/cart" } });
    }
  }, [user?.id, token, navigate]);

  useEffect(() => {
    if (!user?.id || !token) return;
    const sync = () => setLines(getCart());
    sync();
    window.addEventListener("gsp-cart-change", sync);
    window.addEventListener("gsp-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gsp-cart-change", sync);
      window.removeEventListener("gsp-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [user?.id, token]);

  const subtotal = useMemo(() => {
    return lines.reduce(
      (s, l) => s + (Number(l.price) || 0) * (Number(l.quantity) || 0),
      0
    );
  }, [lines]);

  const checkout = async (e) => {
    e.preventDefault();
    setError("");
    const u = getStoredUser();
    const t = localStorage.getItem("token");
    if (!u?.id || !t) {
      navigate("/login", { replace: true, state: { from: "/cart" } });
      return;
    }
    if (cartItemCount(lines) === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        token: t,
        notes: notes.trim(),
        items: lines.map((l) => ({
          product_id: l.product_id,
          quantity: l.quantity,
        })),
      };
      await axios.post(`${API_BASE_URL}/checkout.php`, payload);
      clearCart();
      setLines([]);
      setNotes("");
      navigate("/", { replace: true, state: { orderPlaced: true } });
    } catch (err) {
      const m =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Checkout failed.";
      setError(m);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.id || !token) {
    return null;
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto py-16 px-5">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Your cart</h1>
        <p className="text-gray-600 mb-8">
          Face-to-face payment at pickup. Orders stay <strong>pending</strong> until an admin approves them.
        </p>

        {error ? (
          <div className="mb-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        ) : null}

        {lines.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-600">
            <p className="mb-4">No items yet.</p>
            <Link to="/shop" className="text-green-900 font-semibold underline">
              Browse the shop
            </Link>
          </div>
        ) : (
          <form onSubmit={checkout} className="space-y-8">
            <ul className="bg-white rounded-2xl shadow divide-y divide-gray-100">
              {lines.map((l) => {
                const src = productImageSrc(l);
                return (
                  <li
                    key={l.product_id}
                    className="flex flex-col sm:flex-row gap-4 p-5 sm:items-center"
                  >
                    <div className="w-full sm:w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {src ? (
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-green-900">{l.name}</p>
                      <p className="text-gray-500 text-sm">₱{Number(l.price).toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-600">Qty</label>
                      <input
                        type="number"
                        min={1}
                        max={Number(l.stock) > 0 ? Number(l.stock) : undefined}
                        value={l.quantity}
                        className="border border-gray-300 rounded-lg w-20 px-2 py-2"
                        onChange={(e) => {
                          updateCartLineQuantity(l.product_id, e.target.value);
                          setLines(getCart());
                        }}
                      />
                    </div>
                    <div className="text-right font-bold text-green-900 sm:w-28">
                      ₱{(Number(l.price) * Number(l.quantity)).toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Note to council (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-xl p-3"
                placeholder="Pickup preferences, sizes already confirmed, etc."
              />

              <div className="flex justify-between items-center text-xl font-bold text-green-900 pt-2">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-900 text-white py-4 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit order for approval"}
              </button>
            </div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}
