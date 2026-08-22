import type { CareerPathwayDto } from '../../../types/api'

export function ReadinessChecklist({ status, skillCount, pathway }: { status: string; skillCount: number; pathway?: CareerPathwayDto }) {
  const levels = pathway?.levels ?? []
  const courses = levels.flatMap(level => level.courses)
  const items = [
    ['Career skills assigned', skillCount > 0],
    ['Career published before pathway publication', status === 'Published'],
    ['Pathway contains levels', levels.length > 0],
    ['Every level contains a course', levels.length > 0 && levels.every(level => level.courses.length > 0)],
    ['Pathway contains required courses', courses.some(course => course.isRequired)],
    ['Level and course orders are contiguous', levels.every((level, index) => level.order === index && [...level.courses].sort((a,b) => a.order-b.order).every((course, courseIndex) => course.order === courseIndex))],
  ] as const
  return <aside className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4"><h3 className="font-bold">Publication readiness</h3><p className="mt-1 text-sm text-gray-700">Frontend guidance only. Backend publication checks remain authoritative.</p><ul className="mt-3 space-y-2 text-sm">{items.map(([label, ready]) => <li key={label} className="flex gap-2"><span aria-hidden="true" className={ready ? 'text-emerald-700' : 'text-amber-700'}>{ready ? '✓' : '○'}</span><span><span className="sr-only">{ready ? 'Complete:' : 'Incomplete:'}</span>{label}</span></li>)}</ul><p className="mt-3 text-xs text-gray-600">Open each course to verify lessons, skills, primary skill, resources, assessments, and projects.</p></aside>
}

export function AdminPathwayPreview({ pathway }: { pathway: CareerPathwayDto }) {
  return <section className="mt-5 rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wide text-violet-700">Admin Preview — {pathway.status}</p><h3 className="text-2xl font-bold">{pathway.name}</h3><p className="text-sm text-gray-600">Career Pathway v{pathway.version}</p></div>{pathway.isPrimary && <span className="rounded-full bg-violet-200 px-3 py-1 text-xs font-semibold">Primary pathway</span>}</div><div className="mt-5 space-y-5">{[...pathway.levels].sort((a,b) => a.order-b.order).map((level, levelIndex) => <section key={level.id} className="rounded-lg bg-white p-4 shadow-sm"><h4 className="text-lg font-bold">{level.name || `Level ${levelIndex + 1}`}</h4>{level.description && <p className="mt-1 text-sm text-gray-600">{level.description}</p>}<ol className="mt-3 space-y-2">{[...level.courses].sort((a,b) => a.order-b.order).map(course => <li key={course.id} className="flex flex-wrap items-center gap-2"><span className="font-medium">{course.order + 1}. {course.courseTitle}</span><span className="rounded bg-gray-100 px-2 py-1 text-xs">{course.difficulty}</span><span className={`rounded px-2 py-1 text-xs ${course.isRequired ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>{course.isRequired ? 'Required' : 'Optional'}</span></li>)}</ol></section>)}</div></section>
}
