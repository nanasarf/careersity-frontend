import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useGetEnrollmentsQuery } from "../features/learning-plans/api/enrollmentsApi";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useGetEnrollmentsQuery({ page: 1, pageSize: 10 });

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold text-gray-900">
        Welcome back{user ? `, ${user.firstName}` : ""}
      </h1>
      <p className="mb-8 text-gray-600">Here is your learning progress.</p>

      {/* Active enrollments */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your pathways
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-white p-10 text-center">
            <p className="text-gray-500">
              You are not enrolled in any career pathways yet.
            </p>
            <Link
              to="/careers"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse careers
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.items.map((enrollment) => (
              <div
                key={enrollment.id}
                className="rounded-lg border bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      to={`/learning/enrollments/${enrollment.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {enrollment.careerTitle}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {enrollment.pathwayName} · {enrollment.status}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {enrollment.overallProgressPercentage.toFixed(0)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${enrollment.overallProgressPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {enrollment.completedCourseCount} of{" "}
                  {enrollment.totalRequiredCourseCount} required courses
                  completed
                </p>

                {enrollment.currentCourse && (
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">Continue: </span>
                    <Link
                      to={`/learning/enrollments/${enrollment.id}/courses/${enrollment.currentCourse.courseId}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {enrollment.currentCourse.title}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
