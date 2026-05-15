import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gspLogo from "./gsp_logo.jpg";
import cartlogo from "./cartlogo.png";
import { clearAuth, getStoredUser, userHasAdminRole } from "../utils/auth";
import { cartItemCount, getCart } from "../utils/cart";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [cartCount, setCartCount] = useState(() => {
    const u = getStoredUser();
    const signedIn =
      Boolean(u?.id && typeof window !== "undefined" && localStorage.getItem("token"));
    return signedIn ? cartItemCount(getCart()) : 0;
  });

  useEffect(() => {
    const sync = () => {
      const u = getStoredUser();
      setUser(u);
      const signedIn =
        Boolean(u?.id && typeof window !== "undefined" && localStorage.getItem("token"));
      setCartCount(signedIn ? cartItemCount(getCart()) : 0);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("gsp-auth-change", sync);
    window.addEventListener("gsp-cart-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("gsp-auth-change", sync);
      window.removeEventListener("gsp-cart-change", sync);
    };
  }, []);

  const logout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };

  const loggedIn = Boolean(
    user?.id && typeof window !== "undefined" && localStorage.getItem("token")
  );

  return (
    <div className="bg-green-900 text-white shadow-lg">

      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-4 p-5">

        {/* Left: brand */}
        <div className="flex items-center justify-start gap-3 min-w-0">
          <div className="logo shrink-0">
            <Link
              to="/"
              className="block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-green-900"
              aria-label="Go to home page"
            >
              <img src={gspLogo} alt="" className="h-12 w-auto rounded-full" />
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-left leading-tight">
            GSP Ilocos Norte - Laoag Council
          </h1>
        </div>

        {/* Center: main nav */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-center">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/publications">Publications</Link>
          <Link to="/forms">Forms</Link>
          <Link to="/shop">Shop</Link>
        </nav>

        {/* Right: cart icon + auth */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-end items-center">
          <Link
            to={loggedIn ? "/cart" : "/login"}
            state={loggedIn ? undefined : { from: "/cart" }}
            className="relative inline-flex items-center justify-center shrink-0 rounded-lg hover:bg-white/10 p-1"
            aria-label={
              loggedIn
                ? `Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`
                : "Log in to view your cart"
            }
          >
            <img
              src={cartlogo}
              alt=""
              className="h-8 w-8 object-contain"
              width={32}
              height={32}
            />
            {cartCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center rounded-full bg-amber-400 text-green-950 text-[10px] font-bold leading-none">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>

          {user ? (
            <>
              <Link
                to="/account"
                className="text-sm text-white max-w-[min(160px,28vw)] truncate font-medium hover:underline px-1"
                title={user.email}
              >
                {user.fullname || user.email}
              </Link>
              {userHasAdminRole(user) ? (
                <Link
                  to="/admin/dashboard"
                  className="text-sm text-white/90 hover:text-white underline underline-offset-2 px-1 shrink-0"
                >
                  Admin dashboard
                </Link>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="border border-white px-4 py-2 rounded-xl hover:bg-white/10 text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border border-white px-4 py-2 rounded-xl hover:bg-white/10 text-sm"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="bg-white text-green-900 px-4 py-2 rounded-xl hover:bg-gray-100 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
