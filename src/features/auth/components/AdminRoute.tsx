import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";

/**
 * Route guard that permits only Administrator users.
 * Server still enforces the role; hiding nav is not authorization.
 */
export default function AdminRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored);

  if (!sessionRestored) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-gray-500">Loading…</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "Administrator") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
