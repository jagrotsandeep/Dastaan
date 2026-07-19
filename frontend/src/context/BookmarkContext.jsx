import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api'
import { useAuth } from './AuthContext'

const BookmarkContext = createContext()

export function BookmarkProvider({ children }) {
  const { user } = useAuth()
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())

  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set())
      return
    }
    api.get('/users/bookmarks').then((res) => {
      setBookmarkedIds(new Set(res.data.map((s) => s._id)))
    }).catch(() => {})
  }, [user])

  const isBookmarked = useCallback((storyId) => bookmarkedIds.has(storyId), [bookmarkedIds])

  const toggleBookmark = async (storyId) => {
    if (!user) {
      alert('Bookmark karne ke liye login karo')
      return
    }
    try {
      const res = await api.post(`/users/bookmarks/${storyId}`)
      setBookmarkedIds((prev) => {
        const next = new Set(prev)
        if (res.data.bookmarked) next.add(storyId)
        else next.delete(storyId)
        return next
      })
    } catch (_) {}
  }

  return (
    <BookmarkContext.Provider value={{ isBookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export const useBookmarks = () => useContext(BookmarkContext)