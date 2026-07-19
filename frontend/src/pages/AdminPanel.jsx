import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, BookOpen, Clock, CheckCircle, XCircle, Activity, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import usePageTitle from '../hooks/usePageTitle'
import Avatar from '../components/Avatar'

function AdminPanel({ logout }) {
  usePageTitle('Admin Panel')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('review')
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState(null)
  const [reason, setReason] = useState('')

  const load = () => {
    api.get('/admin/stats').then((res) => setStats(res.data))
    api.get('/admin/pending-stories').then((res) => {
      setPending(res.data)
      setLoading(false)
    })
    api.get('/admin/users').then((res) => setUsers(res.data))
  }

  useEffect(() => {
    if (!user?.isAdmin) return
    load()
    const interval = setInterval(() => {
      api.get('/admin/stats').then((res) => setStats(res.data))
    }, 15000)
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[#706766]">Admin panel dekhne ke liye login karo</p>
        <Link to="/login" className="mt-4 inline-block rounded-full bg-[#c94531] px-6 py-3 font-bold text-white">Login karo</Link>
      </div>
    )
  }

  if (!user.isAdmin) return <p className="p-10 text-center text-[#706766]">Ye page sirf admin ke liye hai</p>

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/stories/${id}/approve`)
      setPending((prev) => prev.filter((s) => s._id !== id))
      load()
    } catch (_) { alert('Approve nahi ho paya') }
  }

  const openReject = (id) => { setRejectingId(id); setReason('') }

  const submitReject = async (id) => {
    if (!reason.trim()) return alert('Reject karne ka karan likho')
    try {
      await api.post(`/admin/stories/${id}/reject`, { reason })
      setPending((prev) => prev.filter((s) => s._id !== id))
      setRejectingId(null)
      load()
    } catch (_) { alert('Reject nahi ho paya') }
  }

  const handleToggleBan = async (id) => {
    try {
      const res = await api.post(`/admin/users/${id}/toggle-ban`)
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBanned: res.data.isBanned } : u)))
    } catch (_) { alert('Kuch galat hua') }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#c94531]">Admin</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
            Admin Panel
          </h1>
        </div>
        <button onClick={handleLogout} className="rounded-full border border-[#c94531]/30 px-4 py-2 text-sm font-bold text-[#c94531]">
          Logout
        </button>
      </div>

      {stats && (
        <div className="mt-6 sm:mt-8 grid gap-4 grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
            <Activity className="text-green-600" />
            <strong className="mt-3 block text-2xl">{stats.activeNow}</strong>
            <span className="text-sm text-[#706766]">Active abhi (5 min)</span>
          </div>
          <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
            <Eye className="text-[#c94531]" />
            <strong className="mt-3 block text-2xl">{stats.viewsToday}</strong>
            <span className="text-sm text-[#706766]">Views aaj</span>
          </div>
          <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
            <Users className="text-[#c94531]" />
            <strong className="mt-3 block text-2xl">{stats.totalUsers}</strong>
            <span className="text-sm text-[#706766]">Total users</span>
          </div>
          <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
            <BookOpen className="text-[#c94531]" />
            <strong className="mt-3 block text-2xl">{stats.totalStories}</strong>
            <span className="text-sm text-[#706766]">Total stories</span>
          </div>
          <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
            <Clock className="text-orange-500" />
            <strong className="mt-3 block text-2xl">{stats.pendingCount}</strong>
            <span className="text-sm text-[#706766]">Pending review</span>
          </div>
          <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
            <CheckCircle className="text-green-600" />
            <strong className="mt-3 block text-2xl">{stats.publishedCount}</strong>
            <span className="text-sm text-[#706766]">Published</span>
          </div>
          <div className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
            <XCircle className="text-red-500" />
            <strong className="mt-3 block text-2xl">{stats.rejectedCount}</strong>
            <span className="text-sm text-[#706766]">Rejected</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-2">
        <button
          onClick={() => setTab('review')}
          className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'review' ? 'bg-[#c94531] text-white' : 'border border-[#4e312a]/13'}`}
        >
          Story Review
        </button>
        <button
          onClick={() => setTab('users')}
          className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'users' ? 'bg-[#c94531] text-white' : 'border border-[#4e312a]/13'}`}
        >
          Users
        </button>
      </div>

      {tab === 'review' && (
        <div className="mt-6">
          {loading && <p className="text-[#706766]">Loading...</p>}
          {!loading && pending.length === 0 && <p className="text-[#706766]">Abhi koi story review ke liye pending nahi hai.</p>}

          <div className="space-y-4">
            {pending.map((story) => (
              <div key={story._id} className="rounded-2xl border p-4 sm:p-5 border-[#4e312a]/13">
                <span className="text-xs font-bold text-[#c94531]">{story.category.toUpperCase()}</span>
                <h3 className="mt-1 text-lg font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
                  {story.title}
                </h3>
                <p className="mt-2 text-sm text-[#706766]">{story.description}</p>
                <p className="mt-2 text-xs text-[#706766]">By {story.author?.username} ({story.author?.email})</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => handleApprove(story._id)} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white">Approve</button>
                  <button onClick={() => openReject(story._id)} className="rounded-xl border border-red-400 px-4 py-2 text-sm font-bold text-red-500">Reject</button>
                </div>

                {rejectingId === story._id && (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reject karne ka karan likho..."
                      className="flex-1 rounded-xl border p-2 text-sm bg-transparent border-[#4e312a]/13"
                    />
                    <button onClick={() => submitReject(story._id)} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white">Confirm Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="mt-6 space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between gap-4 rounded-2xl border p-4 border-[#4e312a]/13">
              <div className="flex items-center gap-3">
                <Avatar src={u.avatar} alt={u.username} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <strong className="block text-[#211b1a] dark:text-[#f8eee8]">{u.username}</strong>
                  <span className="text-xs text-[#706766]">{u.email}</span>
                </div>
              </div>
              <button
                onClick={() => handleToggleBan(u._id)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${u.isBanned ? 'bg-green-600 text-white' : 'border border-red-400 text-red-500'}`}
              >
                {u.isBanned ? 'Unban karo' : 'Ban karo'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPanel