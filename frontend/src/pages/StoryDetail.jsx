import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Bookmark, Share2, Eye, Flag } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useBookmarks } from '../context/BookmarkContext'
import Avatar from '../components/Avatar'
import CommentItem from '../components/CommentItem'
import StoryDetailSkeleton from '../components/StoryDetailSkeleton'
import usePageTitle from '../hooks/usePageTitle'

function buildCommentTree(comments) {
  const map = {}
  comments.forEach((c) => { map[c._id] = { ...c, children: [] } })
  const roots = []
  comments.forEach((c) => {
    if (c.parentComment && map[c.parentComment]) map[c.parentComment].children.push(map[c._id])
    else roots.push(map[c._id])
  })
  return roots
}

function StoryDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const [story, setStory] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reported, setReported] = useState(false)

  usePageTitle(story?.title, story?.description)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setStory(null)
    setReported(false)
    api.get(`/stories/${id}`).then((res) => {
      setStory(res.data)
      setLikeCount(res.data.likes?.length || 0)
      setLiked(user ? res.data.likes.includes(user.id) : false)
      setLoading(false)
    })
    api.get(`/stories/${id}/comments`).then((res) => setComments(res.data))
  }, [id, user])

  const commentTree = useMemo(() => buildCommentTree(comments), [comments])

  const handleLike = async () => {
    if (!user) return alert('Like karne ke liye login karo')
    const res = await api.post(`/stories/${id}/like`)
    setLiked(res.data.liked)
    setLikeCount(res.data.likes)
  }

  const handleBookmark = () => toggleBookmark(id)

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) return alert('Comment karne ke liye login karo')
    if (!commentText.trim()) return
    const res = await api.post(`/stories/${id}/comments`, { text: commentText })
    setComments([res.data, ...comments])
    setCommentText('')
  }

  const handleReply = async (parentId, text) => {
    if (!user) return alert('Reply karne ke liye login karo')
    const res = await api.post(`/stories/${id}/comments`, { text, parentComment: parentId })
    setComments((prev) => [...prev, res.data])
  }

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: story.title, text: story.description })
      else await navigator.clipboard.writeText(window.location.href)
    } catch (_) {}
  }

  const handleReport = async () => {
    if (!user) return alert('Report karne ke liye login karo')
    if (!confirm('Ye story report karni hai?')) return
    try {
      await api.post(`/stories/${id}/report`)
      setReported(true)
    } catch (_) {}
  }

  if (loading) return <StoryDetailSkeleton />
  if (!story) return <p className="p-10 text-center text-[#706766]">Story nahi mili</p>

  const bookmarked = isBookmarked(id)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link to="/" className="mb-6 inline-block font-bold text-[#706766]">← Back to stories</Link>

      <div className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold bg-[#fff0e3] text-[#9f2d20]">
        {story.category.toUpperCase()}
      </div>

      <h1 className="mb-4 font-bold leading-tight text-[#211b1a] dark:text-[#f8eee8] text-3xl sm:text-5xl" style={{ fontFamily: "'Eczar', serif" }}>
        {story.title}
      </h1>

      <p className="mb-4 text-[#706766] text-lg">{story.description}</p>

      <div className="mb-6 flex flex-wrap gap-4 text-sm text-[#706766]">
        <span>{new Date(story.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {story.views}</span>
      </div>

      <Link to={`/profile/${story.author?._id}`} className="mb-8 flex items-center gap-3 rounded-2xl border p-4 border-[#4e312a]/13">
        <Avatar src={story.author?.avatar} alt={story.author?.username} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <strong className="block text-[#211b1a] dark:text-[#f8eee8]">{story.author?.username}</strong>
          <span className="text-xs text-[#706766]">{story.author?.bio || 'Kahaniya writer'}</span>
        </div>
      </Link>

      {story.coverImage && (
        <img className="mb-8 h-64 sm:h-96 w-full rounded-2xl object-cover" src={story.coverImage} alt={story.title} />
      )}

      <div className="mb-8 leading-[1.9] text-[#352b29] dark:text-[#f8eee8] text-lg sm:text-xl" style={{ fontFamily: "'Eczar', serif" }}>
        {story.content.split('\n').map((para, i) => <p key={i} className="mb-5">{para}</p>)}
      </div>

      {story.tags && story.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <span key={tag} className="rounded-full border px-3 py-1.5 text-sm text-[#706766] border-[#4e312a]/13">#{tag}</span>
          ))}
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-3 border-y py-4 border-[#4e312a]/13">
        <button onClick={handleLike} className={`flex items-center gap-2 rounded-full border px-4 py-2.5 font-bold border-[#4e312a]/13 ${liked ? 'bg-[#c94531]/10 text-[#c94531]' : ''}`}>
          <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} /> {likeCount}
        </button>
        <button onClick={handleBookmark} className={`flex items-center gap-2 rounded-full border px-4 py-2.5 font-bold border-[#4e312a]/13 ${bookmarked ? 'bg-[#c94531]/10 text-[#c94531]' : ''}`}>
          <Bookmark className="h-4 w-4" fill={bookmarked ? 'currentColor' : 'none'} /> Bookmark
        </button>
        <button onClick={handleShare} className="flex items-center gap-2 rounded-full border px-4 py-2.5 font-bold border-[#4e312a]/13">
          <Share2 className="h-4 w-4" /> Share
        </button>
        <button onClick={handleReport} disabled={reported} className="ml-auto flex items-center gap-2 text-sm text-[#706766] disabled:opacity-50">
          <Flag className="h-4 w-4" /> {reported ? 'Reported' : 'Report'}
        </button>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>Reader Conversations</h2>
        <form onSubmit={handleComment} className="mb-6 rounded-2xl border p-4 border-[#4e312a]/13">
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)}
            placeholder={user ? 'Apna comment likho...' : 'Comment ke liye login karo'} disabled={!user} rows={3}
            className="mb-3 w-full rounded-xl border p-3 bg-transparent border-[#4e312a]/13" />
          <button type="submit" className="rounded-xl bg-[#c94531] px-5 py-2.5 font-bold text-white">Post Comment</button>
        </form>

        <div className="space-y-4">
          {commentTree.length === 0 && <p className="text-sm text-[#706766]">Pehla comment tum karo!</p>}
          {commentTree.map((c) => <CommentItem key={c._id} comment={c} onReply={handleReply} />)}
        </div>
      </section>
    </div>
  )
}

export default StoryDetail