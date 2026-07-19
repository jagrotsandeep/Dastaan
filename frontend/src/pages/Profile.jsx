import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import Avatar from '../components/Avatar'
import usePageTitle from '../hooks/usePageTitle'

function Profile({ logout }) {
  const { id } = useParams()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [following, setFollowing] = useState(false)
  const navigate = useNavigate()

  const profileId = id || user?.id
  const isOwnProfile = user && profileId === user.id

  usePageTitle(data?.user?.username || 'Profile')

  useEffect(() => {
    if (!profileId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    api.get(`/users/${profileId}`)
      .then((res) => {
        setData(res.data)
        setFollowing(user ? res.data.user.followers.includes(user.id) : false)
        setLoading(false)
      })
      .catch(() => {
        setError('Profile load nahi ho payi')
        setLoading(false)
      })
  }, [profileId, user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleFollow = async () => {
    if (!user) return alert('Follow karne ke liye login karo')
    try {
      const res = await api.post(`/users/${profileId}/follow`)
      setFollowing(res.data.following)
      setData((prev) => ({
        ...prev,
        stats: { ...prev.stats, followers: res.data.followersCount },
      }))
    } catch (_) {}
  }

  if (!user && !id) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[#706766]">Profile dekhne ke liye login karo</p>
        <Link to="/login" className="mt-4 inline-block rounded-full bg-[#c94531] px-6 py-3 font-bold text-white">Login karo</Link>
      </div>
    )
  }

  if (loading) return <p className="p-10 text-center text-[#706766]">Loading...</p>
  if (error || !data) return <p className="p-10 text-center text-[#706766]">Profile nahi mila</p>

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="rounded-3xl border p-6 sm:p-8 border-[#4e312a]/13">
        <div className="flex items-start justify-between gap-4">
          <Avatar
            src={data.user.avatar}
            alt={data.user.username}
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-xl"
          />
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className={`rounded-full px-5 py-2.5 font-bold ${following ? 'border border-[#4e312a]/13 text-[#211b1a] dark:text-[#f8eee8]' : 'bg-[#c94531] text-white'}`}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
          {data.user.username}
        </h1>

        {isOwnProfile && <p className="mt-1 text-[#706766]">{data.user.email}</p>}

        <p className="mt-3 max-w-2xl leading-relaxed text-[#706766]">{data.user.bio || 'Abhi tak koi bio nahi likhi gayi.'}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div><strong className="text-2xl">{data.stats.storiesCount}</strong><span className="block text-sm text-[#706766]">Stories</span></div>
          <div><strong className="text-2xl">{data.stats.followers}</strong><span className="block text-sm text-[#706766]">Followers</span></div>
          <div><strong className="text-2xl">{data.stats.totalViews}</strong><span className="block text-sm text-[#706766]">Total views</span></div>
          <div><strong className="text-2xl">{data.stats.totalLikes}</strong><span className="block text-sm text-[#706766]">Total likes</span></div>
          <div><strong className="text-2xl">{data.stats.following}</strong><span className="block text-sm text-[#706766]">Following</span></div>
        </div>
      </div>

      <h2 className="mt-8 mb-4 text-xl sm:text-2xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
        Published Stories
      </h2>

      {data.stories.length === 0 && <p className="text-[#706766]">Abhi tak koi story publish nahi hui.</p>}

      <div className="space-y-4">
        {data.stories.map((story) => (
          <Link key={story._id} to={`/story/${story._id}`} className="flex gap-4 rounded-2xl border p-4 border-[#4e312a]/13">
            <div>
              <span className="text-xs font-bold text-[#c94531]">{story.category.toUpperCase()}</span>
              <strong className="mt-2 block text-lg font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
                {story.title}
              </strong>
              <small className="mt-2 block text-[#706766]">{story.views} views · {story.likes.length} likes</small>
            </div>
          </Link>
        ))}
      </div>

      {isOwnProfile && (
        <button
          onClick={handleLogout}
          className="mt-10 w-full rounded-xl border border-[#c94531]/30 py-3.5 font-bold text-[#c94531]"
        >
          Logout
        </button>
      )}
    </div>
  )
}

export default Profile