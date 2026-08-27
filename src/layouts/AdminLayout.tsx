import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { authSlice } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/api/authApi";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/career-categories", label: "Career Categories" },
  { to: "/admin/careers", label: "Careers" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/assessments", label: "Assessments" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/providers", label: "Providers" },
  { to: "/admin/instructors", label: "Instructors" },
  { to: "/admin/external-resources", label: "External Resources" },
  { to: "/admin/curriculum-import", label: "Curriculum Import" },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    if (refreshToken) {
      logout({ refreshToken }).catch(() => {});
    }
    dispatch(authSlice.actions.clearSession());
  };

  return (
    <div className="admin-canvas min-h-screen lg:flex">
      <header className="admin-sidebar flex items-center justify-between px-4 py-3 text-white lg:hidden"><Link to="/admin" className="brand text-white"><span className="brand-mark" aria-hidden="true" /> Careersity</Link><button onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="admin-nav" className="rounded border border-gray-600 px-3 py-1">Menu</button></header>
      {/* Sidebar */}
      <aside id="admin-nav" className={`${open ? 'block' : 'hidden'} admin-sidebar w-full shrink-0 border-r lg:block lg:min-h-screen lg:w-64`}>
        <div className="px-4 py-5">
          <Link to="/" className="brand text-white">
            <span className="brand-mark" aria-hidden="true" /> Careersity
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">Admin</p>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-2">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 border-t border-gray-700 px-4 py-4">
          <p className="truncate text-sm text-gray-300">{user?.fullName}</p><p className="truncate text-xs text-gray-500">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 w-full rounded px-3 py-2 text-left text-sm text-gray-400 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <div className="admin-workspace mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
