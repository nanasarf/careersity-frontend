import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCompleteLessonMutation, useGetEnrollmentLessonQuery, useStartLessonMutation } from '../../features/learning-plans/api/enrollmentsApi'
import { ApiErrorNotice } from '../../features/learning-plans/components/LearnerUi'
import { formatMinutes } from '../../features/learning-plans/utils/learnerFormat'

export default function LearnerLessonPage() {
  const { enrollmentId, courseId, lessonId } = useParams<{ enrollmentId: string; courseId: string; lessonId: string }>()
  const args = useMemo(() => ({ enrollmentId: enrollmentId ?? '', courseId: courseId ?? '', lessonId: lessonId ?? '' }), [courseId, enrollmentId, lessonId])
  const query = useGetEnrollmentLessonQuery(args, { skip: !enrollmentId || !courseId || !lessonId })
  const [startLesson, startState] = useStartLessonMutation()
  const [completeLesson, completeState] = useCompleteLessonMutation()
  const startRequested = useRef(false)

  useEffect(() => {
    if (!query.data || query.data.isStarted || query.data.isCompleted || startRequested.current) return
    startRequested.current = true
    void startLesson(args).unwrap().catch(() => { startRequested.current = false })
  }, [args, query.data, startLesson])

  if (query.isLoading) return <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
  if (!query.data) return <ApiErrorNotice error={query.error} />
  const lesson = query.data

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <Link to={`/learning/enrollments/${enrollmentId}/courses/${courseId}`} className="text-sm text-blue-600 hover:underline">← Course</Link>
      <header className="rounded-xl border bg-white p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500"><span>{lesson.contentType}</span><span>·</span><span>{formatMinutes(lesson.estimatedDurationMinutes)}</span><span>·</span><span>{lesson.isRequired ? 'Required' : 'Optional'}</span></div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{lesson.title}</h1>
        {lesson.summary && <p className="mt-2 text-gray-600">{lesson.summary}</p>}
        <p className="mt-3 text-sm font-medium text-blue-700">{lesson.isCompleted ? 'Completed' : lesson.isStarted || startState.isLoading ? 'In progress' : 'Not started'}</p>
      </header>
      <ApiErrorNotice error={startState.error ?? completeState.error} />

      <section className="rounded-xl border bg-white p-6">
        {lesson.content ? <div className="whitespace-pre-wrap leading-7 text-gray-800">{lesson.content}</div> : <p className="text-gray-500">No native lesson content was provided.</p>}
        {lesson.externalResourceUrl && <a href={lesson.externalResourceUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-lg border border-blue-600 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50">Open external lesson resource ↗</a>}
        {!lesson.externalResourceUrl && ['Video', 'ExternalResource'].includes(lesson.contentType) && !lesson.content && <p className="mt-4 text-sm text-amber-700">This lesson does not currently include an external URL.</p>}
      </section>

      <div className="flex justify-end">
        {lesson.isCompleted ? <span className="rounded-lg bg-violet-100 px-4 py-2 font-semibold text-violet-700">Lesson completed</span> : <button disabled={completeState.isLoading || startState.isLoading} onClick={() => completeLesson(args)} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{completeState.isLoading ? 'Completing…' : 'Mark lesson complete'}</button>}
      </div>
    </article>
  )
}
