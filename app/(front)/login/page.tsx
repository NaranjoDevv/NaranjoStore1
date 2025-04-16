'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="py-8 font-mono tracking-tighter">
      <h1 className="text-3xl uppercase mb-8 text-center">"LOGIN"</h1>

      <div className="max-w-md mx-auto">
        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 text-center uppercase text-sm tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block uppercase text-sm tracking-widest mb-2">
              "EMAIL"
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-black transition-all duration-200 ease-in-out"
          >
            {loading ? '"LOADING..."' : '"LOGIN"'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="uppercase text-sm tracking-widest">
            "DON'T HAVE AN ACCOUNT?"
          </p>
          <Link
            href="/register"
            className="mt-2 inline-block uppercase text-sm tracking-widest hover:line-through transition-all duration-200 ease-in-out"
          >
            "REGISTER"
          </Link>
        </div>
      </div>
    </div>
  )
}