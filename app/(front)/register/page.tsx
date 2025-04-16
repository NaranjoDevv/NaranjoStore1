'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Registration failed')
        setLoading(false)
        return
      }

      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="py-8 font-mono tracking-tighter">
      <h1 className="text-3xl uppercase mb-8 text-center">"REGISTER"</h1>
      <div className="max-w-md mx-auto">
        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 text-center uppercase text-sm tracking-widest">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 text-white p-3 mb-4 text-center uppercase text-sm tracking-widest">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block uppercase text-sm tracking-widest mb-2">
              "NAME"
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block uppercase text-sm tracking-widest mb-2">
              "EMAIL"
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block uppercase text-sm tracking-widest mb-2">
              "PASSWORD"
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block uppercase text-sm tracking-widest mb-2">
              "CONFIRM PASSWORD"
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-black transition-all duration-200 ease-in-out"
          >
            {loading ? '"REGISTERING..."' : '"REGISTER"'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="uppercase text-sm tracking-widest">
            "ALREADY HAVE AN ACCOUNT?"
          </p>
          <Link
            href="/login"
            className="mt-2 inline-block uppercase text-sm tracking-widest hover:line-through transition-all duration-200 ease-in-out"
          >
            "LOGIN"
          </Link>
        </div>
      </div>
    </div>
  )
}