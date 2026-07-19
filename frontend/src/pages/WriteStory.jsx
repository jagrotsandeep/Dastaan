import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'

function WriteStory() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  usePageTitle(isEditMode ? 'Story edit karo' : 'Write Story')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(isEditMode)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!isEditMode) return
    api.get(`/stories/edit/${id}`)
      .then((res) => {
        setTitle(res.data.title)
        setDescription(res.data.description)
        setContent(res.data.content)
        setCategory(res.data.category)
        setTagsInput((res.data.tags || []).join(', '))
        setLoading(false)
      })
      .catch((err) => {
        setStatus(err.response?.data?.message || 'Story load nahi ho payi')
        setLoading(false)
      })
  }, [id, isEditMode])

  const handlePublish = async (publishStatus) => {
    if (!user) { setStatus('Pehle login karo story likhne ke liye'); return }
    if (!title || !description || !category || content.length < 30) {
      setStatus('Sab fields bharo, content kam se kam 30 characters ka ho')
      return
    }
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    try {
      if (isEditMode) {
        await api.put(`/stories/${id}`, { title, description, content, category, status: publishStatus, tags })
      } else {
        await api.post('/stories', { title, description, content, category, status: publishStatus, tags })
      }
      setStatus(publishStatus === 'published' ? 'Story review ke liye bhej di gayi. Admin approve karega to live hogi.' : 'Draft save ho gaya')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setStatus(err.response?.data?.message || 'Kuch galat hua')
    }
  }

  if (loading) return <p className="p-10 text-center text-[#706766]">Loading...</p>

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
        {isEditMode ? 'Apni story edit karo' : 'अपनी कहानी को आवाज़ दें'}
      </h1>

      <input placeholder="Story title" value={title} onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full rounded-xl border p-3 bg-transparent border-[#4e312a]/13" />
      <textarea placeholder="Short description (50-80 words)" value={description} onChange={(e) => setDescription(e.target.value)}
        rows={3} className="mb-4 w-full rounded-xl border p-3 bg-transparent border-[#4e312a]/13" />
      <select value={category} onChange={(e) => setCategory(e.target.value)}
        className="mb-4 w-full rounded-xl border p-3 bg-transparent border-[#4e312a]/13">
        <option value="">Category select karo</option>
        <option>Love</option><option>Horror</option><option>Mystery</option>
        <option>Motivation</option><option>History</option><option>Comedy</option>
        <option>Fantasy</option><option>Real Life</option><option>Educational</option><option>Poems</option>
      </select>
      <input placeholder="Tags (comma se alag karo: pyaar, dilli, yaadein)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
        className="mb-4 w-full rounded-xl border p-3 bg-transparent border-[#4e312a]/13" />
      <textarea placeholder="Apni story yahan likho..." value={content} onChange={(e) => setContent(e.target.value)}
        rows={12} className="mb-4 w-full rounded-xl border p-4 bg-transparent border-[#4e312a]/13" />

      <div className="flex gap-3">
        <button onClick={() => handlePublish('draft')} className="rounded-xl border px-5 py-3 font-bold border-[#4e312a]/13">Save Draft</button>
        <button onClick={() => handlePublish('published')} className="rounded-xl bg-[#c94531] px-5 py-3 font-bold text-white">
          Submit for Review
        </button>
      </div>
      {status && <p className="mt-4 font-semibold text-[#c94531]">{status}</p>}
    </div>
  )
}

export default WriteStory