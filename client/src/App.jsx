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
          element={<Dashboard />}
        />

        <Route
          path="/admin/users"
          element={<ManageUsers />}
        />

        <Route
          path="/admin/products"
          element={<ManageProducts />}
        />

        <Route
          path="/admin/orders"
          element={<ManageOrders />}
        />

        <Route
          path="/admin/registrations"
          element={<ManageRegistrations />}
        />

        <Route
          path="/admin/announcements"
          element={<ManageAnnouncements />}
        />

        <Route
          path="/admin/publications"
          element={<ManagePublications />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;