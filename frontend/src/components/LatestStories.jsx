import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import StoryCard from './StoryCard'
import StoryCardSkeleton from './StoryCardSkeleton'
import api from '../api'

function LatestStories() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page')) || 1

  const [stories, setStories] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get('/stories', { params: { page: currentPage, limit: 9 } })
      .then((res) => {
        if (cancelled) return
        setStories(res.data.stories)
        setTotalPages(res.data.totalPages)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('Stories load nahi ho payi. Backend chal raha hai check karo.')
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [currentPage])

  const goToPage = (page) => {
    setSearchParams({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 sm:mb-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#c94531]">
          Fresh from our writers
        </p>
        <h2
          className="font-bold text-[#211b1a] dark:text-[#f8eee8] text-xl sm:text-2xl"
          style={{ fontFamily: "'Eczar', serif" }}
        >
          Latest Stories
        </h2>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && stories.length === 0 && (
        <p className="text-[#706766]">Abhi koi story publish nahi hui. Pehli story tum likho!</p>
      )}

      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading && Array.from({ length: 9 }).map((_, i) => <StoryCardSkeleton key={i} />)}
        {!loading && stories.map((story) => (
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

      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#4e312a]/13 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`h-10 w-10 rounded-full text-sm font-bold ${p === currentPage ? 'bg-[#c94531] text-white' : 'border border-[#4e312a]/13 text-[#211b1a] dark:text-[#f8eee8]'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#4e312a]/13 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  )
}

export default LatestStories