import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

function NotFound() {
  usePageTitle('Page nahi mila')
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[#c94531]" style={{ fontFamily: "'Eczar', serif" }}>404</h1>
      <p className="mt-4 text-lg text-[#211b1a] dark:text-[#f8eee8]">Ye page nahi mila</p>
      <p className="mt-2 text-sm text-[#706766]">Shayad link galat hai ya ye page hata diya gaya hai.</p>
      <Link to="/" className="mt-6 rounded-full bg-[#c94531] px-6 py-3 font-bold text-white">
        Home pe wapas jao
      </Link>
    </div>
  )
}

export default NotFound