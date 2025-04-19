'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [formErrors, setFormErrors] = useState({ email: '', password: '' })

  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    }
    let isValid = true

    if (!email) {
      errors.email = 'EMAIL IS REQUIRED'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'INVALID EMAIL FORMAT'
      isValid = false
    }

    if (!password) {
      errors.password = 'PASSWORD IS REQUIRED'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

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

  // Marcar todos los campos como tocados al intentar enviar el formulario
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    if (validateForm()) {
      handleSubmit(e)
    } else {
      setLoading(false)
    }
  }

  // Validar campo individual cuando pierde el foco
  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateForm()
  }

  return (
    <div className="py-12 font-mono tracking-tighter min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full px-4 sm:px-0">
        <h1 className="text-3xl uppercase mb-8 text-center font-light">"LOGIN"</h1>

        <div className="bg-[var(--background)] border border-gray-300 p-8 shadow-sm">
          {error && (
            <div className="bg-red-500 text-white p-3 mb-6 text-center uppercase text-sm tracking-widest animate-fade-in-up">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block uppercase text-sm tracking-widest mb-2">
                "EMAIL"
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full p-3 bg-transparent border transition-all duration-200
                    ${formErrors.email && touched.email
                      ? 'border-red-500 bg-red-50/10'
                      : 'border-gray-300 focus:outline-none focus:border-black'}`}
                />
                {formErrors.email && touched.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs uppercase tracking-widest">
                    "REQUIRED"
                  </div>
                )}
              </div>
              {formErrors.email && touched.email && (
                <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                  "{formErrors.email}"
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block uppercase text-sm tracking-widest mb-2">
                "PASSWORD"
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full p-3 bg-transparent border transition-all duration-200
                    ${formErrors.password && touched.password
                      ? 'border-red-500 bg-red-50/10'
                      : 'border-gray-300 focus:outline-none focus:border-black'}`}
                />
                {formErrors.password && touched.password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs uppercase tracking-widest">
                    "REQUIRED"
                  </div>
                )}
              </div>
              {formErrors.password && touched.password && (
                <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                  "{formErrors.password}"
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-black transition-all duration-200 ease-in-out mt-4"
            >
              {loading ? '"LOADING..."' : '"LOGIN"'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="uppercase text-sm tracking-widest text-gray-600">
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
    </div>
  )
}