import { useEffect, useState } from 'react'
import type { ApiProblem } from '../../../types/api'

export function problemFrom(error: unknown): ApiProblem | undefined {
  if (!error || typeof error !== 'object' || !('data' in error)) return undefined
  return (error as { data?: ApiProblem }).data
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/\[\d+\]/g, '').replace(/[^a-z0-9]/g, '')
}

export function fieldErrors(error: unknown, field: string) {
  const errors = problemFrom(error)?.errors
  if (!errors) return []
  const wanted = normalizeKey(field)
  return Object.entries(errors)
    .filter(([key]) => normalizeKey(key).endsWith(wanted))
    .flatMap(([, messages]) => messages)
}

export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export const proficiencies = ['Awareness', 'Beginner', 'Intermediate', 'Advanced'] as const
export const sectionClass = 'mt-8 rounded-xl border bg-white p-6'
