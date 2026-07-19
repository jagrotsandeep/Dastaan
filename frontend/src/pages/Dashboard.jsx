import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Eye, Heart, Users, Bookmark, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import usePageTitle from '../hooks/usePageTitle'

const statusStyles = {
  published: 'text-green-600',
  pending: 'text-orange-500',
  rejected: 'text-red-500',
  draft: 'text-[#706766]',
}

function Dashboard() {
  usePageTitle('Dashboard')
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const loadDashboard = () => {
    api.get('/users/dashboard').then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (!user) return
    loadDashboard()
  }, [user])

  const handleDelete = async (storyId) => {
    if (!confirm('Ye story pakke se delete karni hai? Ye wapas nahi aayegi.')) return
    setDeletingId(storyId)
    try {
      await api.delete(`/stories/${storyId}`)
      loadDashboard()
    } catch (_) {
      alert('Delete nahi ho paya')
    }
    setDeletingId(null)
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[#706766]">Dashboard dekhne ke liye login karo</p>
        <Link to="/login" className="mt-4 inline-block rounded-full bg-[#c94531] px-6 py-3 font-bold text-white">Login karo</Link>
      </div>
    )
  }

  if (loading) return <p className="p-10 text-center text-[#706766]">Loading...</p>

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#c94531]">Creator insights</p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
        Your storytelling at a glance
      </h1>

      <div className="mt-6 sm:mt-8 grid gap-4 grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
          <BookOpen className="text-[#c94531]" />
          <strong className="mt-3 block text-2xl sm:text-3xl">{data.storiesCount}</strong>
          <span className="text-sm text-[#706766]">Published stories</span>
        </div>
        <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
          <Eye className="text-[#c94531]" />
          <strong className="mt-3 block text-2xl sm:text-3xl">{data.totalViews}</strong>
          <span className="text-sm text-[#706766]">Total views</span>
        </div>
        <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
          <Heart className="text-[#c94531]" />
          <strong className="mt-3 block text-2xl sm:text-3xl">{data.totalLikes}</strong>
          <span className="text-sm text-[#706766]">Reader likes</span>
        </div>
        <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
          <Users className="text-[#c94531]" />
          <strong className="mt-3 block text-2xl sm:text-3xl">{data.followers}</strong>
          <span className="text-sm text-[#706766]">Followers</span>
        </div>
      </div>

      <Link to="/bookmarks" className="mt-4 flex items-center gap-3 rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
        <Bookmark className="text-[#c94531]" />
        <span className="font-bold text-[#211b1a] dark:text-[#f8eee8]">Bookmarks dekho</span>
      </Link>

      <div className="mt-8 sm:mt-10">
        <h2 className="mb-4 text-xl sm:text-2xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
          Your Stories ({data.draftsCount} drafts)
        </h2>

        {data.recentStories.length === 0 && (
          <p className="text-[#706766]">Abhi tak koi story nahi likhi. <Link to="/write" className="font-bold text-[#c94531]">Pehli story likho</Link></p>
        )}

        <div className="space-y-3">
          {data.recentStories.map((story) => (
            <div key={story._id} className="rounded-2xl border p-4 border-[#4e312a]/13">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className={`text-xs font-bold ${statusStyles[story.status] || ''}`}>
                    {story.status.toUpperCase()}
                  </span>
                  <strong className="mt-1 block text-lg font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
                    {story.title}
                  </strong>
                  <small className="mt-1 block text-[#706766]">{story.views} views · {story.likes.length} likes</small>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to={`/write/${story._id}`} className="rounded-xl border px-4 py-2 text-sm font-bold border-[#4e312a]/13">
                    Edit
                  </Link>
                  {story.status === 'published' && (
                    <Link to={`/story/${story._id}`} className="rounded-xl border px-4 py-2 text-sm font-bold border-[#4e312a]/13">
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(story._id)}
                    disabled={deletingId === story._id}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-red-300 text-red-500"
                    aria-label="Delete story"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {story.status === 'rejected' && story.rejectionReason && (
                <p className="mt-3 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600">
                  Reject karne ka karan: {story.rejectionReason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard