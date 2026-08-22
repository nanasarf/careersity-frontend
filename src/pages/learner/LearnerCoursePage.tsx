import { Link, useParams } from 'react-router-dom'
import {
  useCompleteCourseMutation,
  useCompleteExternalResourceMutation,
  useGetEnrollmentAssessmentsQuery,
  useGetEnrollmentCourseQuery,
  useStartCourseMutation,
  useStartExternalResourceMutation,
} from '../../features/learning-plans/api/enrollmentsApi'
import { ApiErrorNotice, AvailabilityBadge, ProgressBar } from '../../features/learning-plans/components/LearnerUi'
import { formatMinutes } from '../../features/learning-plans/utils/learnerFormat'
import type { LearnerExternalResourceProgressDto } from '../../types/api'

export default function LearnerCoursePage() {
  const { enrollmentId, courseId } = useParams<{ enrollmentId: string; courseId: string }>()
  const args = { enrollmentId: enrollmentId ?? '', courseId: courseId ?? '' }
  const query = useGetEnrollmentCourseQuery(args, { skip: !enrollmentId || !courseId })
  const assessmentQuery = useGetEnrollmentAssessmentsQuery(args, { skip: !enrollmentId || !courseId })
  const [startCourse, startState] = useStartCourseMutation()
  const [completeCourse, completeState] = useCompleteCourseMutation()
  const [startResource, resourceStartState] = useStartExternalResourceMutation()
  const [completeResource, resourceCompleteState] = useCompleteExternalResourceMutation()
  const mutationError = startState.error ?? completeState.error ?? resourceStartState.error ?? resourceCompleteState.error

  if (query.isLoading) return <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
  if (!query.data) return <ApiErrorNotice error={query.error} />
  const course = query.data
  const busy = startState.isLoading || completeState.isLoading

  const handleResourceOpen = async (resource: LearnerExternalResourceProgressDto) => {
    if (!resource.isStarted && !resource.isCompleted) {
      try { await startResource({ ...args, assignmentId: resource.assignmentId }).unwrap() } catch { /* displayed below */ }
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link to={`/learning/enrollments/${enrollmentId}`} className="text-sm text-blue-600 hover:underline">← Pathway</Link>
      <header className="rounded-xl border bg-white p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3"><AvailabilityBadge status={course.availabilityStatus} /><span className="text-sm text-gray-500">{course.difficulty} · {formatMinutes(course.estimatedDurationMinutes)}</span></div>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-2 text-gray-600">{course.shortDescription}</p>
            {course.detailedDescription && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">{course.detailedDescription}</p>}
          </div>
          <strong className="text-2xl text-blue-700">{course.progressPercentage.toFixed(0)}%</strong>
        </div>
        <div className="mt-5"><ProgressBar value={course.progressPercentage} /></div>
        <div className="mt-5 flex flex-wrap gap-3">
          {course.availabilityStatus === 'Available' && <button disabled={busy} onClick={() => startCourse(args)} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{startState.isLoading ? 'Starting…' : 'Start course'}</button>}
          {course.availabilityStatus === 'InProgress' && <button disabled={busy} onClick={() => completeCourse(args)} className="rounded-lg border border-blue-600 px-5 py-2.5 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50">{completeState.isLoading ? 'Checking…' : 'Complete course'}</button>}
          {course.availabilityStatus === 'Locked' && <p className="text-sm text-gray-600">Complete the required prerequisites before starting this course.</p>}
          {course.availabilityStatus === 'Completed' && <p className="font-medium text-violet-700">Course completed</p>}
        </div>
      </header>
      <ApiErrorNotice error={mutationError} />

      {course.prerequisites.length > 0 && <section className="rounded-xl border bg-white p-6"><h2 className="text-xl font-semibold">Prerequisites</h2><ul className="mt-3 space-y-2">{course.prerequisites.map((item) => <li key={item.id} className="text-sm text-gray-700">{item.prerequisiteCourseTitle} <span className="text-gray-400">({item.isRequired ? 'required' : 'recommended'})</span></li>)}</ul></section>}

      <section className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Lessons</h2><span className="text-sm text-gray-500">{course.lessons.filter((x) => x.isCompleted && x.isRequired).length} of {course.lessons.filter((x) => x.isRequired).length} required completed</span></div>
        <ol className="mt-4 space-y-3">{course.lessons.slice().sort((a,b) => a.order-b.order).map((lesson) => <li key={lesson.lessonId} className="flex items-center justify-between gap-4 rounded-lg border p-4"><div><Link to={`/learning/enrollments/${enrollmentId}/courses/${courseId}/lessons/${lesson.lessonId}`} className="font-semibold text-gray-900 hover:text-blue-600">{lesson.order}. {lesson.title}</Link><p className="mt-1 text-xs text-gray-500">{lesson.contentType} · {formatMinutes(lesson.estimatedDurationMinutes)} · {lesson.isRequired ? 'Required' : 'Optional'}</p></div><span className={`text-xs font-semibold ${lesson.isCompleted ? 'text-violet-700' : lesson.isStarted ? 'text-blue-700' : 'text-gray-500'}`}>{lesson.isCompleted ? 'Completed' : lesson.isStarted ? 'In progress' : 'Not started'}</span></li>)}</ol>
      </section>

      {course.externalResources && course.externalResources.length > 0 && <section className="rounded-xl border bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold">External learning resources</h2><span className="text-sm text-gray-500">{course.completedRequiredExternalResourceCount} of {course.totalRequiredExternalResourceCount} required completed</span></div><p className="mt-1 text-xs text-gray-500">Third-party resources open in a new tab. Completion is your self-confirmation.</p><div className="mt-4 space-y-3">{course.externalResources.slice().sort((a,b) => a.order-b.order).map((resource) => <article key={resource.assignmentId} className="rounded-lg border p-4"><div className="flex flex-wrap justify-between gap-3"><div><a href={resource.url} target="_blank" rel="noopener noreferrer" onClick={() => void handleResourceOpen(resource)} className="font-semibold text-blue-700 hover:underline">{resource.title} ↗</a><p className="mt-1 text-sm text-gray-600">{resource.providerName}{resource.instructorName ? ` · ${resource.instructorName}` : ''}</p><p className="mt-1 text-xs text-gray-500">{resource.resourceType} · {resource.accessType} · {resource.isRequired ? 'Required' : 'Optional'}{resource.estimatedDurationMinutes != null ? ` · ${formatMinutes(resource.estimatedDurationMinutes)}` : ''}</p>{resource.description && <p className="mt-2 text-sm text-gray-600">{resource.description}</p>}</div>{!resource.isCompleted ? <button disabled={resourceCompleteState.isLoading} onClick={() => completeResource({...args, assignmentId: resource.assignmentId})} className="self-start rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50">Confirm complete</button> : <span className="text-sm font-semibold text-violet-700">Completed</span>}</div></article>)}</div></section>}

      {course.projects.length > 0 && <section className="rounded-xl border bg-white p-6"><h2 className="text-xl font-semibold">Projects</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{course.projects.map((project) => <article key={project.id} className="rounded-lg border p-4"><h3 className="font-semibold">{project.title}</h3><p className="mt-1 text-sm text-gray-600">{project.description}</p><p className="mt-2 text-xs text-gray-500">{project.submissionType} · {formatMinutes(project.estimatedDurationMinutes)}</p></article>)}</div></section>}

      {assessmentQuery.data && assessmentQuery.data.length > 0 && <section className="rounded-xl border bg-white p-6"><h2 className="text-xl font-semibold">Assessments</h2><div className="mt-4 space-y-3">{assessmentQuery.data.map((assessment) => <article key={assessment.assessmentId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><div className="flex items-center gap-2"><h3 className="font-semibold">{assessment.title}</h3>{assessment.hasPassed && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Passed</span>}</div><p className="mt-1 text-xs text-gray-500">Pass mark {assessment.passingScorePercentage}% · {assessment.questionCount} questions · {assessment.attemptsUsed} used · {assessment.attemptsRemaining == null ? 'Unlimited remaining' : `${assessment.attemptsRemaining} remaining`}</p></div><Link to={`/learning/enrollments/${enrollmentId}/courses/${courseId}/assessments/${assessment.assessmentId}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{assessment.activeAttemptId ? 'Resume attempt' : assessment.hasPassed ? 'View / retry' : 'Start assessment'}</Link></article>)}</div></section>}
    </div>
  )
}
