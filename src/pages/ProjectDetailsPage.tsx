import { Link, useParams } from 'react-router-dom'
import { useGetProjectDetailQuery } from '../features/courses/api/coursesApi'
import { ApiErrorNotice } from '../features/learning-plans/components/LearnerUi'

function minutes(value: number) {
  return value < 60 ? `${value} minutes` : `${Math.floor(value / 60)}h ${value % 60 ? `${value % 60}m` : ''}`
}

export default function ProjectDetailsPage() {
  const { courseSlug, projectId } = useParams<{ courseSlug: string; projectId: string }>()
  const { data, error, isLoading } = useGetProjectDetailQuery({ courseSlug: courseSlug ?? '', projectId: projectId ?? '' }, { skip: !courseSlug || !projectId })
  if (isLoading) return <div className="mx-auto mt-12 h-52 max-w-4xl animate-pulse rounded-xl bg-gray-200" />
  if (!data) return <div className="mx-auto max-w-4xl px-4 py-12"><ApiErrorNotice error={error} /></div>
  return <article className="mx-auto max-w-4xl space-y-7 px-4 py-10">
    <Link to={`/courses/${data.courseSlug}`} className="text-sm text-blue-600 hover:underline">← {data.courseTitle}</Link>
    <header><div className="mb-3 flex gap-2 text-sm text-gray-500"><span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">{data.submissionType}</span><span className="py-1">{minutes(data.estimatedDurationMinutes)}</span></div><h1 className="text-4xl font-bold text-gray-900">{data.title}</h1><p className="mt-3 text-lg text-gray-600">{data.description}</p></header>
    <section className="rounded-xl border bg-white p-6"><h2 className="text-xl font-semibold">Instructions</h2><div className="mt-3 whitespace-pre-wrap text-gray-700">{data.instructions}</div></section>
    {data.expectedOutput && <section><h2 className="text-xl font-semibold">Expected output</h2><p className="mt-2 whitespace-pre-wrap text-gray-700">{data.expectedOutput}</p></section>}
    {data.evaluationCriteria && <section><h2 className="text-xl font-semibold">Evaluation criteria</h2><p className="mt-2 whitespace-pre-wrap text-gray-700">{data.evaluationCriteria}</p></section>}
    <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">This page describes the curriculum project. Project submission is not available in Careersity.</p>
  </article>
}
