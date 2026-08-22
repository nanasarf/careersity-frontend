export function isAuthenticationEndpoint(url: string): boolean {
  return url.startsWith('/api/auth/')
}

export function requestUrl(args: string | { url: string }): string {
  return typeof args === 'string' ? args : args.url
}

export function redirectToLogin(): void {
  if (typeof window === 'undefined') return
  if (window.location.pathname === '/login') return

  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
  window.location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`)
}

