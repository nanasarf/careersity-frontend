import { useMemo, useState } from 'react'
import { fieldErrors } from './adminAuthoringUtils'

export function FieldError({ error, field }: { error: unknown; field: string }) {
  const messages = fieldErrors(error, field)
  return messages.length ? <p className="mt-1 text-xs text-red-700">{messages.join(' ')}</p> : null
}

export interface SelectOption { id: string; label: string; description?: string }

export function SearchSelector({ label, value, onChange, options, loading, error, disabled, excludeIds = [], onSearch }: {
  label: string; value: string; onChange: (id: string) => void; options: SelectOption[]
  loading?: boolean; error?: unknown; disabled?: boolean; excludeIds?: string[]; onSearch?: (value: string) => void
}) {
  const [search, setSearch] = useState('')
  const excluded = useMemo(() => new Set(excludeIds), [excludeIds])
  const visible = options.filter(option => !excluded.has(option.id))
  return <label className="block text-sm font-medium">
    {label}
    <input value={search} onChange={e => { setSearch(e.target.value); onSearch?.(e.target.value) }} disabled={disabled}
      placeholder={`Search ${label.toLowerCase()}…`} className="mt-1 w-full rounded-lg border px-3 py-2" />
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled || loading}
      className="mt-2 w-full rounded-lg border px-3 py-2">
      <option value="">{loading ? 'Loading…' : `Select ${label.toLowerCase()}…`}</option>
      {visible.map(option => <option key={option.id} value={option.id}>{option.label}{option.description ? ` — ${option.description}` : ''}</option>)}
    </select>
    {!loading && visible.length === 0 && <span className="mt-1 block text-xs text-gray-600">No matching choices.</span>}
    {error ? <span className="mt-1 block text-xs text-red-700">Could not load choices.</span> : null}
  </label>
}

export function ReorderButtons({ index, count, disabled, onMove }: {
  index: number; count: number; disabled?: boolean; onMove: (direction: -1 | 1) => void
}) {
  return <div className="flex gap-1" aria-label="Reorder item">
    <button type="button" onClick={() => onMove(-1)} disabled={disabled || index === 0}
      className="rounded border px-2 py-1 text-xs disabled:opacity-40" aria-label="Move up">Move Up</button>
    <button type="button" onClick={() => onMove(1)} disabled={disabled || index === count - 1}
      className="rounded border px-2 py-1 text-xs disabled:opacity-40" aria-label="Move down">Move Down</button>
  </div>
}
