import { Outlet, NavLink, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { authSlice } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/api/authApi";

export default function LearnerLayout() {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    if (refreshToken) {
      logout({ refreshToken }).catch(() => {
        // Logout is idempotent — clear locally regardless of server response.
      });
    }
    dispatch(authSlice.actions.clearSession());
  };

  return (
    <div className="site-shell">
      <header className="site-nav">
        <div className="site-nav-inner">
          <Link to="/" className="brand"><span className="brand-mark" aria-hidden="true" /> Careersity
          </Link>

          <nav className="nav-links" aria-label="Learner navigation">
            <NavLink
              to="/careers"
              className={({ isActive }) => `nav-link nav-optional${isActive ? " active" : ""}`}
            >
              Browse
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              Dashboard
            </NavLink>
          </nav>

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-gray-600 sm:inline">{user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="learner-canvas flex-1">
        <div className="learner-workspace mx-auto max-w-7xl px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
