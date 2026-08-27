export type YouTubeSearchVariant = 'tutorial' | 'full-course' | 'university'

type SearchContext = {
  careerTitle?: string | null
  courseTitle?: string | null
  lessonTitle?: string | null
  variant?: YouTubeSearchVariant
}

const fillerWords = new Set([
  'a', 'an', 'and', 'course', 'for', 'fundamental', 'fundamentals', 'in',
  'introduction', 'introductory', 'lesson', 'of', 'the', 'to', 'with',
])

const words = (value?: string | null) =>
  (value?.match(/[\p{L}\p{N}+#.&'-]+/gu) ?? []).map(word => word.replace(/[.&'-]+$/g, ''))

/** Builds a concise search while retaining the most specific lesson and course terms. */
export function buildYouTubeQuery({ careerTitle, courseTitle, lessonTitle, variant = 'tutorial' }: SearchContext) {
  const lessonWords = words(lessonTitle)
  const courseWords = words(courseTitle)
  const careerWords = words(careerTitle)
  const seen = new Set<string>()
  const result: string[] = []

  const add = (candidates: string[], limit: number) => {
    let added = 0
    for (const word of candidates) {
      const key = word.toLocaleLowerCase()
      if (!key || fillerWords.has(key) || seen.has(key) || added >= limit) continue
      seen.add(key)
      result.push(word)
      added += 1
    }
  }

  // Course terms establish the subject; lesson terms supply the specific topic.
  add(courseWords, lessonWords.length ? 4 : 6)
  add(lessonWords, 5)
  // Career context is useful, but lowest priority so a query stays focused.
  add(careerWords, result.length < 6 ? 2 : 0)

  if (variant === 'full-course') result.push('full course')
  else if (variant === 'university') result.push('university lecture')
  else result.push('tutorial')

  return result.join(' ').trim()
}

export function buildYouTubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`
}

export function normalizeExternalUrl(value: string) {
  try {
    const url = new URL(value.trim())
    url.hash = ''
    url.hostname = url.hostname.toLocaleLowerCase()
    url.pathname = url.pathname.replace(/\/$/, '')
    return url.toString()
  } catch {
    return value.trim().replace(/\/$/, '').toLocaleLowerCase()
  }
}
