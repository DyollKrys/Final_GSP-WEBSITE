import {
  BookOpen,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-72 bg-green-900 text-white p-5 shadow-2xl">

        <h1 className="text-3xl font-bold mb-10">
          GSP Admin
        </h1>

        <div className="space-y-3">

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-700 transition-all"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-700 transition-all"
          >
            <Users size={20} />
            Users
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-700 transition-all"
          >
            <ShoppingBag size={20} />
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-700 transition-all"
          >
            <ClipboardList size={20} />
            Orders
          </Link>

          <Link
            to="/admin/registrations"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-700 transition-all"
          >
            <ClipboardList size={20} />
            Registrations
          </Link>

          <Link
            to="/admin/announcements"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-700 transition-all"
          >
            <Bell size={20} />
            Announcements
          </Link>

          <Link
            to="/admin/publications"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-700 transition-all"
          >
            <BookOpen size={20} />
            Publications
          </Link>

        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10 overflow-auto">
        {children}
      </div>

    </div>
  )
}