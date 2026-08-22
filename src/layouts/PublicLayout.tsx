import { Outlet, Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function PublicLayout() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="site-shell">
      <header className="site-nav">
        <div className="site-nav-inner">
          <Link to="/" className="brand" aria-label="Careersity home">
            <span className="brand-mark" aria-hidden="true" /> Careersity
          </Link>

          <nav className="nav-links" aria-label="Primary navigation">
            <NavLink
              to="/careers"
              className={({ isActive }) => `nav-link nav-optional${isActive ? " active" : ""}`}
            >
              Careers
            </NavLink>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  >
                    Admin
                  </NavLink>
                )}
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                >
                  Dashboard
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className="nav-cta"
                >
                  Get started
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer"><div className="site-footer-inner"><p>
          © {new Date().getFullYear()} Careersity. Free, structured learning
          pathways.
        </p><p>Purposeful pathways. Practical learning.</p></div>
      </footer>
    </div>
  );
}
