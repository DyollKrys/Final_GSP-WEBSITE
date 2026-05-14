import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PublicLayout from "../layouts/PublicLayout";
import { API_BASE_URL } from "../config/apiBase";
import { getStoredUser } from "../utils/auth";

function statusBadgeClass(status) {
  const s = String(status || "").toLowerCase();
  if (s === "pending") return "bg-amber-100 text-amber-900";
  if (s === "approved") return "bg-green-100 text-green-900";
  if (s === "rejected") return "bg-red-100 text-red-900";
  if (s === "completed") return "bg-gray-200 text-gray-800";
  return "bg-gray-100 text-gray-700";
}

function isPending(order) {
  return String(order?.status || "").toLowerCase() === "pending";
}

function OrderCard({ order, userId, token, onChanged }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const [notes, setNotes] = useState(order.notes ?? "");
  const [lines, setLines] = useState(() =>
    items.map((it) => ({
      product_id: it.product_id,
      product_name: it.product_name,
      quantity: Number(it.quantity) || 1,
      unit_price: it.unit_price,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");

  const subtotal = lines.reduce(
    (s, l) => s + (Number(l.unit_price) || 0) * (Number(l.quantity) || 0),
    0
  );

  const save = async () => {
    setErr("");
    if (lines.length === 0) {
      setErr("Add at least one line (or delete the order).");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/update_my_order.php`, {
        user_id: userId,
        token,
        order_id: order.id,
        notes: notes.trim(),
        items: lines.map((l) => ({
          product_id: l.product_id,
          quantity: Math.max(1, Math.floor(Number(l.quantity) || 1)),
        })),
      });
      await onChanged();
    } catch (e) {
      setErr(
        e?.response?.data?.message || e?.response?.data?.detail || "Could not save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete order #${order.id}? This cannot be undone.`)) return;
    setErr("");
    setDeleting(true);
    try {
      await axios.post(`${API_BASE_URL}/delete_my_order.php`, {
        user_id: userId,
        token,
        order_id: order.id,
      });
      await onChanged();
    } catch (e) {
      const msg = e?.response?.data?.message || "Could not delete.";
      window.alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  const removeLine = (idx) => {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const setQty = (idx, raw) => {
    const q = Math.max(1, Math.floor(Number(raw) || 1));
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, quantity: q } : l)));
  };

  const pending = isPending(order);

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono font-semibold text-green-900">#{order.id}</span>
          <span
            className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${statusBadgeClass(
              order.status
            )}`}
          >
            {order.status}
          </span>
          <span className="text-sm text-gray-500">
            {order.created_at
              ? new Date(order.created_at).toLocaleString()
              : ""}
          </span>
        </div>
        <div className="text-lg font-bold text-green-900">₱{Number(order.total).toFixed(2)}</div>
      </div>

      <div className="p-5 space-y-4">
        {err ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {err}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 pr-2">Product</th>
                <th className="pb-2 pr-2 w-24">Qty</th>
                <th className="pb-2 text-right">Line</th>
                {pending ? <th className="pb-2 w-10" /> : null}
              </tr>
            </thead>
            <tbody>
              {lines.map((l, idx) => (
                <tr key={`${l.product_id}-${idx}`} className="border-b border-gray-50">
                  <td className="py-2 pr-2">
                    <div className="font-medium text-gray-900">{l.product_name}</div>
                    <div className="text-xs text-gray-400">ID {l.product_id}</div>
                  </td>
                  <td className="py-2 pr-2">
                    {pending ? (
                      <input
                        type="number"
                        min={1}
                        value={l.quantity}
                        onChange={(e) => setQty(idx, e.target.value)}
                        className="border border-gray-300 rounded-lg w-full px-2 py-1"
                      />
                    ) : (
                      l.quantity
                    )}
                  </td>
                  <td className="py-2 text-right">
                    ₱{(Number(l.unit_price) * Number(l.quantity)).toFixed(2)}
                  </td>
                  {pending ? (
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="text-red-600 text-xs font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note to council</label>
          {pending ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-600">{order.notes || "—"}</p>
          )}
        </div>

        {pending ? (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Draft subtotal: <strong>₱{subtotal.toFixed(2)}</strong> (saved total updates on Save)
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={remove}
                className="border border-red-300 text-red-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
              >
                Delete order
              </button>
              <button
                type="button"
                disabled={saving || lines.length === 0}
                onClick={save}
                className="bg-green-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-900 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
            This order can no longer be edited or deleted. Approved orders are prepared for pickup;
            contact the council if you need help.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Account() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getStoredUser();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const load = useCallback(async () => {
    if (!user?.id || !token) return;
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/my_orders.php`, {
        user_id: user.id,
        token,
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setOrders([]);
      setError(e?.response?.data?.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    if (!user?.id || !token) {
      navigate("/login", { replace: true, state: { from: "/account" } });
      return;
    }
    load();
  }, [user?.id, token, navigate, load]);

  if (!user?.id || !token) {
    return null;
  }

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto py-14 px-5">
        <h1 className="text-4xl font-bold text-green-900 mb-2">My account</h1>
        <p className="text-gray-600 mb-2">
          Signed in as{" "}
          <span className="font-medium text-gray-900">{user.fullname || user.email}</span>
        </p>
        <p className="text-sm text-gray-500 mb-10">
          <Link to="/shop" className="text-green-900 font-semibold underline">
            Continue shopping
          </Link>
          {" · "}
          <Link to="/cart" className="text-green-900 font-semibold underline">
            Cart
          </Link>
        </p>

        <h2 className="text-2xl font-bold text-green-900 mb-4">My orders</h2>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : error ? (
          <p className="text-red-700">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <OrderCard
                key={`${o.id}-${o.total}-${o.status}`}
                order={o}
                userId={user.id}
                token={token}
                onChanged={load}
              />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
