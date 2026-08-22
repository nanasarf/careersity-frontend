import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetCareerBySlugQuery } from "../features/careers/api/careersApi";
import {
  useEnrollInCareerMutation,
  useGetEnrollmentsQuery,
} from "../features/learning-plans/api/enrollmentsApi";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ApiErrorNotice } from "../features/learning-plans/components/LearnerUi";
import { useState } from "react";

export default function CareerDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: career,
    isLoading,
    isError,
  } = useGetCareerBySlugQuery(slug ?? "", {
    skip: !slug,
  });
  const [enroll, { isLoading: isEnrolling }] = useEnrollInCareerMutation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrollmentError, setEnrollmentError] = useState<unknown>();
  const { data: enrollments } = useGetEnrollmentsQuery(
    { includeHistory: true, page: 1, pageSize: 100 },
    { skip: !isAuthenticated },
  );

  const existingEnrollment = enrollments?.items.find(
    (enrollment) =>
      enrollment.careerId === career?.id && enrollment.status !== "Withdrawn",
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (isError || !career) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Career not found</h1>
        <p className="mt-2 text-gray-600">
          This career may no longer be available.
        </p>
        <Link
          to="/careers"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Browse all careers
        </Link>
      </div>
    );
  }

  const handleEnroll = async () => {
    setEnrollmentError(undefined);
    try {
      const enrollment = await enroll({ careerId: career.id }).unwrap();
      navigate(`/learning/enrollments/${enrollment.id}`);
    } catch (error) {
      setEnrollmentError(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/careers" className="hover:text-blue-600">
          Careers
        </Link>{" "}
        / {career.careerCategory.name}
      </nav>

      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium uppercase tracking-wide text-blue-600">
          {career.careerCategory.name}
        </p>
        <h1 className="text-4xl font-bold text-gray-900">{career.title}</h1>
        <p className="mt-3 text-lg text-gray-600">{career.shortDescription}</p>

        {isAuthenticated ? (
          existingEnrollment ? (
            <Link
              to={`/learning/enrollments/${existingEnrollment.id}`}
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {existingEnrollment.status === "Completed"
                ? "Review this pathway"
                : "Continue this pathway"}
            </Link>
          ) : career.primaryPathway ? (
            <button
              onClick={() => void handleEnroll()}
              disabled={isEnrolling}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isEnrolling ? "Enrolling…" : "Start this pathway"}
            </button>
          ) : (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              This career is not open for enrollment yet because its learning
              pathway has not been published.
            </div>
          )
        ) : (
          <Link
            to="/register"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create a free account to start
          </Link>
        )}
        {Boolean(enrollmentError) && (
          <div className="mt-4">
            <ApiErrorNotice error={enrollmentError} />
          </div>
        )}
      </div>

      {/* Description */}
      {career.detailedDescription && (
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-gray-900">
            About this career
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {career.detailedDescription}
          </p>
        </section>
      )}

      {/* Skills */}
      {career.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-gray-900">
            Skills you will build
          </h2>
          <div className="flex flex-wrap gap-2">
            {career.skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border bg-gray-50 px-3 py-1 text-sm text-gray-700"
              >
                {skill.skillName}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Pathway overview */}
      {career.primaryPathway && career.primaryPathway.levels.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Learning pathway
          </h2>
          <div className="space-y-4">
            {career.primaryPathway.levels
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((level) => (
                <div key={level.id} className="rounded-lg border bg-white p-5">
                  <h3 className="font-semibold text-gray-900">
                    Level {level.order}: {level.name}
                  </h3>
                  {level.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {level.description}
                    </p>
                  )}
                  <ul className="mt-3 space-y-1">
                    {level.courses
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((course) => (
                        <li
                          key={course.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              course.isRequired ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          />
                          <Link
                            to={`/courses/${course.courseSlug}`}
                            className="text-gray-700 hover:text-blue-600 hover:underline"
                          >
                            {course.courseTitle}
                          </Link>
                          {!course.isRequired && (
                            <span className="text-xs text-gray-400">
                              (optional)
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
