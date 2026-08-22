import type { ApiProblem, CourseAvailabilityStatus } from '../../../types/api'

function problemFrom(error: unknown): ApiProblem | undefined {
  if (!error || typeof error !== 'object' || !('data' in error)) return undefined
  const data = (error as { data?: unknown }).data
  if (!data || typeof data !== 'object' || !('status' in data)) return undefined
  return data as ApiProblem
}

export function ApiErrorNotice({ error }: { error: unknown }) {
  const problem = problemFrom(error)
  if (!problem) return null
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <p className="font-semibold">{problem.title}</p>
      {problem.detail && <p className="mt-1">{problem.detail}</p>}
      {problem.errors && <ul className="mt-2 list-disc space-y-1 pl-5">
        {Object.entries(problem.errors).flatMap(([field, messages]) =>
          messages.map((message) => <li key={`${field}-${message}`}><span className="font-medium">{field}:</span> {message}</li>),
        )}
      </ul>}
      {problem.traceId && <p className="mt-2 text-xs text-red-600">Reference: {problem.traceId}</p>}
    </div>
  )
}

const availabilityStyles: Record<CourseAvailabilityStatus, string> = {
  Locked: 'bg-gray-100 text-gray-600',
  Available: 'bg-emerald-100 text-emerald-700',
  InProgress: 'bg-blue-100 text-blue-700',
  Completed: 'bg-violet-100 text-violet-700',
}

export function AvailabilityBadge({ status }: { status: CourseAvailabilityStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${availabilityStyles[status]}`}>{status}</span>
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-200" aria-label={`${value}% complete`}>
      <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}
