import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser, userHasAdminRole } from "../utils/auth";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!user?.id || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }
  if (!userHasAdminRole(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
