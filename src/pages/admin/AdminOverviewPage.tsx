import { Link } from "react-router-dom";

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Overview</h1>
      <p className="text-gray-600">Welcome to the Careersity admin panel.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { to: "/admin/career-categories", label: "Career Categories" },
          { to: "/admin/careers", label: "Careers" },
          { to: "/admin/skills", label: "Skills" },
          { to: "/admin/courses", label: "Courses" },
          { to: "/admin/providers", label: "Providers" },
          { to: "/admin/import", label: "Curriculum Import" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="font-semibold text-gray-900">{label}</p>
            <p className="mt-1 text-sm text-gray-500">Manage →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
