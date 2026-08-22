import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetEnrollmentQuery,
  usePauseEnrollmentMutation,
  useResumeEnrollmentMutation,
  useWithdrawEnrollmentMutation,
} from "../../features/learning-plans/api/enrollmentsApi";
import {
  ApiErrorNotice,
  AvailabilityBadge,
  ProgressBar,
} from "../../features/learning-plans/components/LearnerUi";

export default function EnrollmentDetailPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const {
    data: enrollment,
    error,
    isLoading,
  } = useGetEnrollmentQuery(enrollmentId ?? "", { skip: !enrollmentId });
  const [pause, pauseState] = usePauseEnrollmentMutation();
  const [resume, resumeState] = useResumeEnrollmentMutation();
  const [withdraw, withdrawState] = useWithdrawEnrollmentMutation();
  const [notice, setNotice] = useState<string>();
  const [actionError, setActionError] = useState<unknown>();

  const mutate = async (action: "pause" | "resume" | "withdraw") => {
    if (!enrollmentId) return;
    if (
      action === "withdraw" &&
      !window.confirm(
        "Withdraw from this pathway? Your enrollment history will remain, but you will no longer be able to continue learning.",
      )
    )
      return;
    if (
      action === "pause" &&
      !window.confirm("Pause this enrollment? You can resume it later.")
    )
      return;
    setNotice(undefined);
    setActionError(undefined);
    try {
      if (action === "pause") await pause(enrollmentId).unwrap();
      else if (action === "resume") await resume(enrollmentId).unwrap();
      else await withdraw(enrollmentId).unwrap();
      setNotice(
        action === "pause"
          ? "Enrollment paused."
          : action === "resume"
            ? "Enrollment resumed."
            : "Enrollment withdrawn.",
      );
    } catch (mutationError) {
      setActionError(mutationError);
    }
  };

  if (isLoading)
    return <div className="h-48 animate-pulse rounded-xl bg-gray-200" />;
  if (!enrollment) return <ApiErrorNotice error={error} />;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
        ← Dashboard
      </Link>
      <header className="rounded-xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {enrollment.pathway.name} · {enrollment.pathway.version}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {enrollment.career.title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enrollment status: {enrollment.status}
            </p>
          </div>
          <strong className="text-2xl text-blue-700">
            {enrollment.overallProgressPercentage.toFixed(0)}%
          </strong>
        </div>
        <div className="mt-5">
          <ProgressBar value={enrollment.overallProgressPercentage} />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {enrollment.completedRequiredCourseCount} of{" "}
          {enrollment.totalRequiredCourseCount} required courses completed
        </p>
        {(enrollment.status === "Active" || enrollment.status === "Paused") && (
          <div className="mt-5 flex flex-wrap gap-3 border-t pt-5">
            {enrollment.status === "Active" && (
              <button
                disabled={pauseState.isLoading || withdrawState.isLoading}
                onClick={() => void mutate("pause")}
                className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                {pauseState.isLoading ? "Pausing…" : "Pause enrollment"}
              </button>
            )}
            {enrollment.status === "Paused" && (
              <button
                disabled={resumeState.isLoading || withdrawState.isLoading}
                onClick={() => void mutate("resume")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {resumeState.isLoading ? "Resuming…" : "Resume enrollment"}
              </button>
            )}
            <button
              disabled={
                pauseState.isLoading ||
                resumeState.isLoading ||
                withdrawState.isLoading
              }
              onClick={() => void mutate("withdraw")}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {withdrawState.isLoading ? "Withdrawing…" : "Withdraw enrollment"}
            </button>
          </div>
        )}
      </header>

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}
      {!!actionError && <ApiErrorNotice error={actionError} />}

      <div className="space-y-6">
        {enrollment.levels
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((level) => (
            <section key={level.id} className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Level {level.order}
                  </p>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {level.name}
                  </h2>
                  {level.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {level.description}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {level.progressPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="mt-4">
                <ProgressBar value={level.progressPercentage} />
              </div>
              <ol className="mt-5 space-y-3">
                {level.courses
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((course) => (
                    <li
                      key={course.courseId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-400">
                            {course.order}.
                          </span>
                          {course.availabilityStatus === "Locked" ? (
                            <span className="font-semibold text-gray-600">
                              {course.title}
                            </span>
                          ) : (
                            <Link
                              className="font-semibold text-gray-900 hover:text-blue-600"
                              to={`/learning/enrollments/${enrollment.id}/courses/${course.courseId}`}
                            >
                              {course.title}
                            </Link>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {course.difficulty} ·{" "}
                          {course.isRequired ? "Required" : "Optional"} ·{" "}
                          {course.progressPercentage.toFixed(0)}%
                        </p>
                      </div>
                      <AvailabilityBadge status={course.availabilityStatus} />
                    </li>
                  ))}
              </ol>
            </section>
          ))}
      </div>
    </div>
  );
}
