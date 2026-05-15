import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_BASE_URL } from "../../config/apiBase";
import { withAdminAuth } from "../../utils/auth";

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

function statusStyle(status) {
  const s = String(status || "").toLowerCase();
  if (s === "pending") return "bg-amber-100 text-amber-900";
  if (s === "approved") return "bg-green-100 text-green-900";
  if (s === "rejected") return "bg-red-100 text-red-900";
  if (s === "completed") return "bg-gray-200 text-gray-800";
  return "bg-gray-100 text-gray-700";
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/orders.php`, withAdminAuth());
      const data = res.data;
      if (Array.isArray(data)) {
        setOrders(data);
        return;
      }
      if (data?.message) {
        setError([data.message, data.hint].filter(Boolean).join(" "));
        setOrders([]);
        return;
      }
      setOrders([]);
    } catch (e) {
      const d = e?.response?.data;
      setError(
        [d?.message, d?.hint].filter(Boolean).join(" ") || "Could not load orders."
      );
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Set order #${id} to "${status}"?`)) return;
    setBusyId(id);
    try {
      await axios.put(`${API_BASE_URL}/update_order.php`, { id, status }, withAdminAuth());
      await fetchOrders();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.detail || "Update failed.";
      window.alert(msg);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-green-900 mb-4">Manage orders</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        New shop checkouts start as <strong>pending</strong>. Approve to reserve stock (deducted from inventory), or reject to decline. Mark{" "}
        <strong>completed</strong> after face-to-face pickup when an order was already approved.
      </p>

      {error ? (
        <div className="mb-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-3xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-green-900 text-white">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Items</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const name =
                order.user_fullname?.trim() ||
                order.user_email ||
                (order.user_id ? `User #${order.user_id}` : "—");
              const busy = busyId === order.id;
              const st = String(order.status || "").toLowerCase();
              return (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                  <td className="p-4 font-mono">{order.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-green-900">{name}</div>
                    {order.user_email ? (
                      <div className="text-sm text-gray-500">{order.user_email}</div>
                    ) : null}
                    {order.notes ? (
                      <div className="text-sm text-gray-600 mt-2 max-w-xs">
                        <span className="font-semibold">Note:</span> {order.notes}
                      </div>
                    ) : null}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {items.length === 0 ? (
                      <span className="text-gray-400">No line items</span>
                    ) : (
                      <ul className="space-y-1 max-w-md">
                        {items.map((it) => (
                          <li key={it.id}>
                            {it.product_name}{" "}
                            <span className="text-gray-500">
                              ×{it.quantity} @ ₱{it.unit_price}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold">₱{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyle(
                        st
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {fmtDate(order.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {st === "pending" ? (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(order.id, "approved")}
                            className="bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(order.id, "rejected")}
                            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      {st === "approved" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => updateStatus(order.id, "completed")}
                          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 disabled:opacity-50"
                        >
                          Mark picked up
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && !error ? (
          <p className="p-10 text-center text-gray-500">No orders yet.</p>
        ) : null}
      </div>
    </AdminLayout>
  );
}
