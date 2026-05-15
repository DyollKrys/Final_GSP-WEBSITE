import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_BASE_URL } from "../../config/apiBase";
import { withAdminAuth } from "../../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin_stats.php`, withAdminAuth());
        if (!cancelled) setStats(res.data);
      } catch {
        if (!cancelled) setStats(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { title: "Total Users", value: stats?.users ?? "—" },
    { title: "Orders", value: stats?.orders ?? "—" },
    { title: "Pending shop orders", value: stats?.pending_orders ?? "—" },
    { title: "Products", value: stats?.products ?? "—" },
    { title: "Registrations", value: stats?.registrations ?? "—" },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-green-800 hover:text-green-950 underline underline-offset-2"
        >
          Back to home
        </button>
      </div>

      <h1 className="text-5xl font-bold text-green-900 mb-10">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition-all"
          >
            <h2 className="text-gray-500 text-lg">{card.title}</h2>

            <p className="text-5xl font-bold text-green-900 mt-4">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
