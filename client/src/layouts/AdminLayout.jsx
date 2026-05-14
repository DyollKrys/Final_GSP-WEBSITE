import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >

      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          background: "#14532d",
          color: "white",
          padding: "20px",
        }}
      >

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          GSP Admin
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >

          <Link
            to="/admin/dashboard"
            style={{ color: "white", textDecoration: "none" }}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            style={{ color: "white", textDecoration: "none" }}
          >
            Users
          </Link>

          <Link
            to="/admin/products"
            style={{ color: "white", textDecoration: "none" }}
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            style={{ color: "white", textDecoration: "none" }}
          >
            Orders
          </Link>

          <Link
            to="/admin/registrations"
            style={{ color: "white", textDecoration: "none" }}
          >
            Registrations
          </Link>

          <Link
            to="/admin/announcements"
            style={{ color: "white", textDecoration: "none" }}
          >
            Announcements
          </Link>

          <Link
            to="/admin/publications"
            style={{ color: "white", textDecoration: "none" }}
          >
            Publications
          </Link>

        </div>

      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        {children}
      </div>

    </div>
  );
}