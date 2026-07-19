import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'

function Login() {
  usePageTitle('Login')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login({ id: res.data.id, username: res.data.username, email: res.data.email, isAdmin: res.data.isAdmin }, res.data.token)
      navigate(res.data.isAdmin ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login fail ho gaya')
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
        Login karo
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
          className="w-full rounded-xl border p-3 bg-transparent border-[#4e312a]/13"
        />
        <input
          name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
          className="w-full rounded-xl border p-3 bg-transparent border-[#4e312a]/13"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#c94531] py-3 font-bold text-white">
          {loading ? 'Ruko...' : 'Login karo'}
        </button>
      </form>
      <p className="mt-4 text-sm text-[#706766]">
        Account nahi hai? <Link to="/register" className="font-bold text-[#c94531]">Register karo</Link>
      </p>
    </div>
  )
}

export default Login