import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const categories = [
  { name: 'Love', icon: '♥', count: '2,481 stories' },
  { name: 'Horror', icon: '☾', count: '1,250 stories' },
  { name: 'Mystery', icon: '⌕', count: '986 stories' },
  { name: 'Motivation', icon: '↗', count: '1,730 stories' },
  { name: 'History', icon: '◫', count: '764 stories' },
  { name: 'Comedy', icon: '☺', count: '1,106 stories' },
  { name: 'Fantasy', icon: '✦', count: '892 stories' },
  { name: 'Real Life', icon: '◎', count: '2,204 stories' },
  { name: 'Educational', icon: '▤', count: '640 stories' },
  { name: 'Poems', icon: '❦', count: '3,120 poems' },
]

function Categories() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

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
            हर एहसास की एक दास्तान
          </h2>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[#706766] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/search?category=${cat.name}`)}
              className="rounded-2xl p-4 text-left bg-white dark:bg-[#251e1d] border border-[#4e312a]/13 transition-transform hover:-translate-y-1 active:scale-95"
            >
              <span className="mb-2 sm:mb-3 block text-xl sm:text-2xl">{cat.icon}</span>
              <span className="block font-bold text-[#211b1a] dark:text-[#f8eee8] text-sm sm:text-base">{cat.name}</span>
              <small className="mt-1 block text-xs text-[#706766]">{cat.count}</small>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default Categories