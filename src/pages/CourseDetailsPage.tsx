import { useParams, Link } from "react-router-dom";
import { useGetCourseBySlugQuery, useGetCourseProjectsQuery } from "../features/courses/api/coursesApi";

const difficultyLabel: Record<string, string> = {
  Foundation: "Foundation",
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
};

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function CourseDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: course,
    isLoading,
    isError,
  } = useGetCourseBySlugQuery(slug ?? "", {
    skip: !slug,
  });
  const { data: projects } = useGetCourseProjectsQuery(slug ?? '', { skip: !slug })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        <Link
          to="/careers"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Browse careers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
            {difficultyLabel[course.difficulty]}
          </span>
          <span className="text-gray-500">
            {formatMinutes(course.estimatedDurationMinutes)}
          </span>
          <span className="text-gray-500">{course.lessons.length} lessons</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-3 text-lg text-gray-600">{course.shortDescription}</p>
      </div>

      {/* Skills */}
      {course.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((s) => (
              <span
                key={s.id}
                className="rounded-full border bg-gray-50 px-3 py-1 text-sm text-gray-700"
              >
                {s.skillName}
                {s.isPrimary && <span className="ml-1 text-blue-500">★</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Prerequisites */}
      {course.prerequisites.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Prerequisites
          </h2>
          <ul className="space-y-1">
            {course.prerequisites.map((prereq) => (
              <li key={prereq.id}>
                <Link
                  to={`/courses/${prereq.prerequisiteCourseSlug}`}
                  className="text-blue-600 hover:underline"
                >
                  {prereq.prerequisiteCourseTitle}
                </Link>
                {!prereq.isRequired && (
                  <span className="ml-2 text-xs text-gray-400">
                    (recommended)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Lessons */}
      {course.lessons.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Lessons</h2>
          <ol className="space-y-2">
            {course.lessons
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((lesson, idx) => (
                <li
                  key={lesson.id}
                  className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800">{lesson.title}</span>
                    {!lesson.isRequired && (
                      <span className="text-xs text-gray-400">(optional)</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatMinutes(lesson.estimatedDurationMinutes)}
                  </span>
                </li>
              ))}
          </ol>
        </section>
      )}
      {projects && projects.length > 0 && <section className="mb-8"><h2 className="mb-4 text-xl font-semibold text-gray-900">Projects</h2><div className="grid gap-3">{projects.map(project => <Link key={project.id} to={`/courses/${course.slug}/projects/${project.id}`} className="rounded-lg border bg-white p-4 hover:border-blue-300"><div className="font-semibold text-gray-900">{project.title}</div><p className="mt-1 text-sm text-gray-600">{project.description}</p><span className="mt-2 inline-block text-sm text-blue-600">View project details →</span></Link>)}</div></section>}
    </div>
  );
}
