const CORRELATION_HEADER = 'X-Correlation-ID'

function fallbackId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('')
}

export function createCorrelationId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : fallbackId()
}

export function attachCorrelationId(headers: Headers): Headers {
  if (!headers.has(CORRELATION_HEADER)) {
    headers.set(CORRELATION_HEADER, createCorrelationId())
  }
  return headers
}

