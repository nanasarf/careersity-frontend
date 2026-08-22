import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";

/**
 * Route guard for authenticated learners and administrators.
 * Renders a loading state while session restoration is in progress.
 */
export default function ProtectedRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored);

  if (!sessionRestored) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-gray-500">Loading…</span>
      </div>
    );
  }

  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
