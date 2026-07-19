import { useNavigate, Link } from 'react-router-dom'
import { Eye, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react'
import { useBookmarks } from '../context/BookmarkContext'
import Avatar from './Avatar'

function StoryCard({ story }) {
  const navigate = useNavigate()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const bookmarked = isBookmarked(story.id)

  const handleCardClick = () => navigate(`/story/${story.id}`)

  const handleBookmark = (e) => {
    e.stopPropagation()
    toggleBookmark(story.id)
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: story.description })
      } else {
        await navigator.clipboard.writeText(story.title)
      }
    } catch (_) {}
  }

  const goToAuthor = (e) => {
    e.stopPropagation()
  }

  return (
    <article
      onClick={handleCardClick}
      className="cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-[#251e1d] border border-[#4e312a]/13 transition-transform hover:-translate-y-1"
    >
      {story.cover ? (
        <img loading="lazy" className="h-44 sm:h-56 w-full object-cover" src={story.cover} alt={story.title} />
      ) : (
        <div className="h-44 sm:h-56 w-full bg-[#f3e7dd] dark:bg-[#2b2320]" />
      )}

      <div className="p-4 sm:p-6">
        <div className="mb-2 sm:mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-bold bg-[#fff0e3] text-[#9f2d20]">
            {story.category.toUpperCase()}
          </span>
          <span className="text-xs text-[#706766]">{story.date} · {story.readTime}</span>
        </div>

        <h3
          className="font-bold leading-tight text-[#211b1a] dark:text-[#f8eee8] text-lg sm:text-2xl"
          style={{ fontFamily: "'Eczar', serif" }}
        >
          {story.title}
        </h3>

        <p className="mt-2 sm:mt-3 leading-relaxed text-[#706766] text-sm">
          {story.description}
        </p>

        <Link
          to={`/profile/${story.author.id}`}
          onClick={goToAuthor}
          className="mt-4 flex items-center gap-3"
        >
          <Avatar
            src={story.author.avatar}
            alt={story.author.name}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
          />
          <div>
            <strong className="block text-sm sm:text-base text-[#211b1a] dark:text-[#f8eee8]">
              {story.author.name}
            </strong>
            <span className="text-xs text-[#706766]">{story.author.followers} followers</span>
          </div>
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t pt-3 sm:pt-4 text-xs sm:text-sm text-[#706766] border-[#4e312a]/13">
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {story.views}</span>
          <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {story.likes}</span>
          <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {story.comments}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="flex-1 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base font-bold bg-[#c94531] text-white text-center">
            Read Full Story
          </div>
          <button
            onClick={handleBookmark}
            className={`grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl border active:scale-95 transition-transform border-[#4e312a]/13 ${bookmarked ? 'bg-[#c94531]/10 text-[#c94531]' : ''}`}
            aria-pressed={bookmarked}
            aria-label="Bookmark story"
          >
            <Bookmark className="h-4 w-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl border active:scale-95 transition-transform border-[#4e312a]/13"
            aria-label="Share story"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default StoryCard