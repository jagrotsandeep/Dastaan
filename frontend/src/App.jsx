import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BookmarkProvider } from './context/BookmarkContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Categories from './components/Categories'
import LatestStories from './components/LatestStories'
import AdSlot from './components/AdSlot'
import Login from './pages/Login'
import Register from './pages/Register'
import WriteStory from './pages/WriteStory'
import StoryDetail from './pages/StoryDetail'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Bookmarks from './pages/Bookmarks'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'
import usePageTitle from './hooks/usePageTitle'
import useTrackPageView from './hooks/useTrackPageView'

function HomePage() {
  usePageTitle(null)
  return (
    <>
      <Categories />
      <AdSlot />
      <LatestStories />
    </>
  )
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const toggleDarkMode = () => setDarkMode((prev) => !prev)
  const { user, logout } = useAuth()
  useTrackPageView()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-[#fffaf3] to-[#f8eee8] dark:from-[#171313] dark:to-[#171313]">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} logout={logout} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/write" element={<WriteStory />} />
          <Route path="/write/:id" element={<WriteStory />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile logout={logout} />} />
          <Route path="/profile/:id" element={<Profile logout={logout} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/admin" element={<AdminPanel logout={logout} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <AppContent />
      </BookmarkProvider>
    </AuthProvider>
  )
}

export default App