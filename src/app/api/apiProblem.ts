import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { ApiProblem } from '../../types/api'

const fallbackTitles: Record<number, string> = {
  400: 'Request validation failed',
  401: 'Authentication required',
  403: 'Access forbidden',
  404: 'Resource not found',
  409: 'Request conflicts with current state',
  429: 'Too many requests',
  503: 'Service unavailable',
}

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function validationErrors(value: unknown): Record<string, string[]> | undefined {
  const source = record(value)
  if (!source) return undefined

  const result: Record<string, string[]> = {}
  for (const [field, messages] of Object.entries(source)) {
    if (Array.isArray(messages)) {
      result[field] = messages.filter((message): message is string => typeof message === 'string')
    }
  }
  return Object.keys(result).length > 0 ? result : undefined
}

export function normalizeApiError(error: FetchBaseQueryError): FetchBaseQueryError {
  if (typeof error.status !== 'number') return error

  const source = record(error.data)
  const problem: ApiProblem = {
    type: stringValue(source?.type) ?? `https://httpstatuses.com/${error.status}`,
    title: stringValue(source?.title) ?? fallbackTitles[error.status] ?? 'Request failed',
    status: error.status,
    detail: stringValue(source?.detail),
    instance: stringValue(source?.instance),
    traceId: stringValue(source?.traceId),
    errors: validationErrors(source?.errors),
  }

  return { ...error, data: problem }
}

export function errorsForField(problem: ApiProblem | undefined, field: string): string[] {
  if (!problem?.errors) return []
  const match = Object.keys(problem.errors).find(
    (candidate) => candidate.toLocaleLowerCase() === field.toLocaleLowerCase(),
  )
  return match ? problem.errors[match] : []
}

