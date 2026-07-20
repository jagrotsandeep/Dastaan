import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import api from '../api'

const categories = [
  { name: 'Love', icon: '♥' },
  { name: 'Horror', icon: '☾' },
  { name: 'Mystery', icon: '⌕' },
  { name: 'Motivation', icon: '↗' },
  { name: 'History', icon: '◫' },
  { name: 'Comedy', icon: '☺' },
  { name: 'Fantasy', icon: '✦' },
  { name: 'Real Life', icon: '◎' },
  { name: 'Educational', icon: '▤' },
  { name: 'Poems', icon: '❦' },
]

function Categories() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState({})

  useEffect(() => {
    api.get('/stories/category-counts').then((res) => setCounts(res.data)).catch(() => {})
  }, [])

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 text-left bg-white dark:bg-[#251e1d] border-[#4e312a]/13"
      >
        <div>
          <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#c94531]">
            Browse by mood
          </p>
          <h2 className="font-bold text-[#211b1a] dark:text-[#f8eee8] text-xl sm:text-2xl" style={{ fontFamily: "'Eczar', serif" }}>
            हर एहसास की एक कहानी
          </h2>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[#706766] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => {
            const count = counts[cat.name] || 0
            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/search?category=${cat.name}`)}
                className="rounded-2xl p-4 text-left bg-white dark:bg-[#251e1d] border border-[#4e312a]/13 transition-transform hover:-translate-y-1 active:scale-95"
              >
                <span className="mb-2 sm:mb-3 block text-xl sm:text-2xl">{cat.icon}</span>
                <span className="block font-bold text-[#211b1a] dark:text-[#f8eee8] text-sm sm:text-base">{cat.name}</span>
                <small className="mt-1 block text-xs text-[#706766]">
                  {count} {count === 1 ? 'story' : 'stories'}
                </small>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Categories