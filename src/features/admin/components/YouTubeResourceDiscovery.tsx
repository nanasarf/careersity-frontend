import { useEffect, useState } from 'react'
import { buildYouTubeQuery, buildYouTubeSearchUrl, type YouTubeSearchVariant } from './youtubeSearch'

type Props = {
  careerTitle?: string | null
  courseTitle?: string | null
  lessonTitle?: string | null
  courseLevel?: boolean
}

export function YouTubeResourceDiscovery({ careerTitle, courseTitle, lessonTitle, courseLevel = false }: Props) {
  const [variant, setVariant] = useState<YouTubeSearchVariant>(courseLevel ? 'full-course' : 'tutorial')
  const generated = buildYouTubeQuery({ careerTitle, courseTitle, lessonTitle, variant })
  const [query, setQuery] = useState(generated)

  useEffect(() => setQuery(generated), [generated])

  return <div className="rounded-lg border border-red-200 bg-red-50 p-4 md:col-span-2">
    <div className="flex flex-wrap items-end gap-3">
      <label className="min-w-64 flex-1 text-sm font-medium">Search query
        <input value={query} onChange={event => setQuery(event.target.value)} className="mt-1 w-full rounded border bg-white px-3 py-2" aria-label="YouTube search query"/>
      </label>
      <label className="text-sm font-medium">Search type
        <select value={variant} onChange={event => setVariant(event.target.value as YouTubeSearchVariant)} className="mt-1 block rounded border bg-white px-3 py-2">
          <option value="tutorial">Tutorial</option>
          <option value="full-course">Full course</option>
          <option value="university">University lecture</option>
        </select>
      </label>
      <a href={buildYouTubeSearchUrl(query)} target="_blank" rel="noopener noreferrer" aria-disabled={!query.trim()} onClick={event => { if (!query.trim()) event.preventDefault() }} className={`rounded bg-red-700 px-4 py-2 font-semibold text-white ${query.trim() ? '' : 'pointer-events-none opacity-50'}`}>Search YouTube ↗</a>
    </div>
    <p className="mt-2 text-xs text-gray-600">Opens YouTube results in a new tab. Review candidates before adding a resource; Careersity does not endorse search results.</p>
  </div>
}
