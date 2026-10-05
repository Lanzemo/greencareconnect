import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "PARENT") {
      return <Navigate to="/parent/dashboard" replace />;
    }

    if (user.role === "CAREGIVER") {
      return <Navigate to="/caregiver/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}