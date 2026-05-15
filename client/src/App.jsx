import { BrowserRouter, Routes, Route } from "react-router-dom";

/* PUBLIC PAGES */
import Home from "./pages/Home";
import About from "./pages/About";
import Publications from "./pages/Publications";
import Forms from "./pages/Forms";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TroopRegistration from "./pages/TroopRegistration";

/* ADMIN PAGES */
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageRegistrations from "./pages/admin/ManageRegistrations";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManagePublications from "./pages/admin/ManagePublications";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/publications"
          element={<Publications />}
        />

        <Route
          path="/forms"
          element={<Forms />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/account"
          element={<Account />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/troop-registration"
          element={<TroopRegistration />}
        />



        {/* ========================= */}
        {/* ADMIN ROUTES */}
        {/* ========================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/registrations"
          element={
            <AdminRoute>
              <ManageRegistrations />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <AdminRoute>
              <ManageAnnouncements />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/publications"
          element={
            <AdminRoute>
              <ManagePublications />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;