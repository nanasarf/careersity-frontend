import { Link } from 'react-router-dom'
import type { CourseDetailDto, CourseExternalResourceDto } from '../../../types/api'

export function CourseReadiness({ course, resources }: { course?: CourseDetailDto; resources: CourseExternalResourceDto[] }) {
  if (!course) return null
  const items = [
    ['At least one required lesson', course.lessons.some(lesson => lesson.isRequired)],
    ['At least one skill assigned', course.skills.length > 0],
    ['A primary skill selected', course.skills.some(skill => skill.isPrimary)],
    ['Lesson orders are contiguous', [...course.lessons].sort((a,b) => a.order-b.order).every((lesson, index) => lesson.order === index)],
    ['Resource assignment orders are contiguous', [...resources].sort((a,b) => a.order-b.order).every((resource, index) => resource.order === index)],
    ['Assigned resources retain provider attribution', resources.every(resource => Boolean(resource.providerName && resource.title && resource.url))],
  ] as const
  return <aside className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4"><h2 className="font-bold">Course publication readiness</h2><p className="mt-1 text-sm text-gray-700">Guidance from loaded Draft data; backend publication validation remains authoritative.</p><ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">{items.map(([label, ready]) => <li key={label} className="flex gap-2"><span aria-hidden="true" className={ready ? 'text-emerald-700' : 'text-amber-700'}>{ready ? '✓' : '○'}</span><span><span className="sr-only">{ready ? 'Complete:' : 'Incomplete:'}</span>{label}</span></li>)}</ul></aside>
}

export function CourseActivityActions({ courseId }: { courseId: string }) {
  const returnTo = encodeURIComponent(`/admin/courses/${courseId}`)
  return <section className="mt-8 rounded-xl border bg-white p-6"><h2 className="text-xl font-bold">Assessments and projects</h2><p className="mt-1 text-sm text-gray-600">Add optional curriculum activities for this course, then return directly to this workspace.</p><div className="mt-4 flex flex-wrap gap-3"><Link to={`/admin/assessments/new?courseId=${courseId}&returnTo=${returnTo}`} className="rounded border border-blue-600 px-4 py-2 font-semibold text-blue-700">Create assessment</Link><Link to={`/admin/projects/new?courseId=${courseId}&returnTo=${returnTo}`} className="rounded border border-blue-600 px-4 py-2 font-semibold text-blue-700">Create project</Link><Link to={`/admin/assessments?courseId=${courseId}`} className="rounded border px-4 py-2">View course assessments</Link><Link to={`/admin/projects?courseId=${courseId}`} className="rounded border px-4 py-2">View course projects</Link></div></section>
}
