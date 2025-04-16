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
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+57') // Default to Colombia
  const [address, setAddress] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate Colombian phone format (10 digits after country code)
    const fullPhone = `${countryCode}${phone}`
    if (fullPhone !== '+57' && !/^\+57[0-9]{10}$/.test(fullPhone)) {
      setError('El número celular debe tener 10 dígitos (ej: 3001234567)')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: fullPhone,
          address
        }),
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block uppercase text-sm tracking-widest mb-2">
                Código país
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
              >
                <option value="+57">CO +57</option>
                {/* <option value="+1">🇺🇸 +1</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+51">🇵🇪 +51</option>
                <option value="+593">🇪🇨 +593</option> */}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block uppercase text-sm tracking-widest mb-2">
                Número celular
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="3001234567"
                className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
                required
              />
            </div>
          </div>
          <div>
            <label className="block uppercase text-sm tracking-widest mb-2">
              Dirección completa
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black h-32"
              placeholder="Ej: Carrera 45 # 20-10, Barrio El Poblado, Medellín"
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

      </div>
    </div>
  )
}