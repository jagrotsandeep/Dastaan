import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StoryCard from '../components/StoryCard'
import StoryCardSkeleton from '../components/StoryCardSkeleton'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import usePageTitle from '../hooks/usePageTitle'

function Bookmarks() {
  const { user } = useAuth()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  usePageTitle('Bookmarks')

  useEffect(() => {
    if (!user) return
    api.get('/users/bookmarks').then((res) => {
      setStories(res.data)
      setLoading(false)
    })
  }, [user])

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[#706766]">Bookmarks dekhne ke liye login karo</p>
        <Link to="/login" className="mt-4 inline-block rounded-full bg-[#c94531] px-6 py-3 font-bold text-white">Login karo</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
        तुम्हारी पसंदीदा कहानियाँ
      </h1>

      {!loading && stories.length === 0 && <p className="text-[#706766]">Abhi tak koi story bookmark nahi ki.</p>}

      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <StoryCardSkeleton key={i} />)}
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
    </div>
  )
}

export default Bookmarks