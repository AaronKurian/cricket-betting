import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const SignupPage = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await signup(form)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-arcade px-6 py-12">
      <form className="w-full max-w-md rounded-2xl border border-fuchsia-300/15 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(217,70,239,0.08)]" onSubmit={handleSubmit}>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-300">Join the arena</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Start with 10,000 virtual credits.</p>
        <label className="mt-8 block text-sm text-slate-300">Name
          <input className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-fuchsia-300/60" name="name" onChange={handleChange} required value={form.name} />
        </label>
        <label className="mt-4 block text-sm text-slate-300">Email
          <input className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-fuchsia-300/60" name="email" onChange={handleChange} required type="email" value={form.email} />
        </label>
        <label className="mt-4 block text-sm text-slate-300">Password
          <span className="relative mt-2 block">
            <input className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none focus:border-fuchsia-300/60" name="password" onChange={handleChange} required type={showPassword ? 'text' : 'password'} value={form.password} />
            <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-fuchsia-200" onClick={() => setShowPassword((visible) => !visible)} type="button">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </span>
        </label>
        {error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
        <button className="mt-6 w-full rounded-lg bg-fuchsia-500 px-5 py-3 font-bold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting} type="submit">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-400">Already registered? <Link className="text-cyan-300 hover:text-cyan-200" to="/login">Login</Link></p>
      </form>
    </main>
  )
}

export default SignupPage
