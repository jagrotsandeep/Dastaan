import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import StoryCard from '../components/StoryCard'
import StoryCardSkeleton from '../components/StoryCardSkeleton'
import api from '../api'
import usePageTitle from '../hooks/usePageTitle'

const categories = ['all', 'Love', 'Horror', 'Mystery', 'Motivation', 'History', 'Comedy', 'Fantasy', 'Real Life', 'Educational', 'Poems']

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''
  const urlCategory = searchParams.get('category') || 'all'

  const [inputValue, setInputValue] = useState(urlQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  usePageTitle('Search')

  useEffect(() => {
    setInputValue(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = {}
    if (urlQuery) params.search = urlQuery
    if (urlCategory !== 'all') params.category = urlCategory

    api.get('/stories', { params })
      .then((res) => {
        if (cancelled) return
        setResults(res.data)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setResults([])
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [urlQuery, urlCategory])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearchParams({ q: inputValue, category: urlCategory })
  }

  const handleCategoryChange = (e) => {
    setSearchParams({ q: urlQuery, category: e.target.value })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#c94531]">Discover</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
          अपनी अगली पसंदीदा कहानी खोजें
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 sm:mt-8 grid max-w-4xl gap-3 rounded-2xl border p-4 border-[#4e312a]/13 sm:grid-cols-[1fr_180px_auto]">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706766]" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by title, tag..."
            className="h-12 w-full rounded-xl border bg-transparent pl-11 pr-4 border-[#4e312a]/13"
          />
        </div>
        <select
          value={urlCategory}
          onChange={handleCategoryChange}
          className="h-12 rounded-xl border bg-transparent px-3 border-[#4e312a]/13"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
          ))}
        </select>
        <button type="submit" className="h-12 rounded-xl bg-[#c94531] px-6 font-bold text-white">
          Search
        </button>
      </form>

      <div className="mt-8 sm:mt-10 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
          Stories for you
        </h2>
        <span className="text-sm text-[#706766]">{loading ? '...' : `${results.length} results`}</span>
      </div>

      {!loading && results.length === 0 && (
        <p className="mt-6 py-10 text-center text-[#706766]">No stories match these filters. Try a different word or category.</p>
      )}

      <div className="mt-6 grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => <StoryCardSkeleton key={i} />)}
        {!loading && results.map((story) => (
          <StoryCard
            key={story._id}
            story={{
              id: story._id,
              title: story.title,
              description: story.description,
              category: story.category,
              date: new Date(story.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              readTime: `${Math.ceil(story.content.split(' ').length / 200)} min`,
              cover: story.coverImage || null,
              author: {
                id: story.author?._id,
                name: story.author?.username || 'Unknown',
                followers: '0',
                avatar: story.author?.avatar || '',
              },
              views: story.views,
              likes: story.likes?.length || 0,
              comments: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Search