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
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    address: false
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: ''
    }
    let isValid = true

    // Validar nombre
    if (!name) {
      errors.name = 'NAME IS REQUIRED'
      isValid = false
    }

    // Validar email
    if (!email) {
      errors.email = 'EMAIL IS REQUIRED'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'INVALID EMAIL FORMAT'
      isValid = false
    }

    // Validar contraseña
    if (!password) {
      errors.password = 'PASSWORD IS REQUIRED'
      isValid = false
    } else if (password.length < 6) {
      errors.password = 'PASSWORD MUST BE AT LEAST 6 CHARACTERS'
      isValid = false
    }

    // Validar confirmación de contraseña
    if (!confirmPassword) {
      errors.confirmPassword = 'CONFIRM PASSWORD IS REQUIRED'
      isValid = false
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'PASSWORDS DO NOT MATCH'
      isValid = false
    }

    // Validar teléfono
    if (!phone) {
      errors.phone = 'PHONE NUMBER IS REQUIRED'
      isValid = false
    } else if (!/^[0-9]{10}$/.test(phone)) {
      errors.phone = 'PHONE MUST BE 10 DIGITS'
      isValid = false
    }

    // Validar dirección
    if (!address) {
      errors.address = 'ADDRESS IS REQUIRED'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Marcar todos los campos como tocados al intentar enviar el formulario
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      address: true
    })

    if (validateForm()) {
      handleSubmit(e)
    }
  }

  // Validar campo individual cuando pierde el foco
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validate Colombian phone format (10 digits after country code)
    const fullPhone = `${countryCode}${phone}`

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
          <div className="bg-red-500 text-white p-3 mb-4 text-center uppercase text-sm tracking-widest animate-fade-in-up">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 text-white p-3 mb-4 text-center uppercase text-sm tracking-widest animate-fade-in-up">
            {success}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block uppercase text-sm tracking-widest mb-2">
              "NAME"
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full p-3 bg-transparent border transition-all duration-200
                  ${formErrors.name && touched.name
                    ? 'border-red-500 bg-red-50/10'
                    : 'border-gray-300 focus:outline-none focus:border-black'}`}
              />

            </div>
            {formErrors.name && touched.name && (
              <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                "{formErrors.name}"
              </p>
            )}
          </div>

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

            </div>
            {formErrors.email && touched.email && (
              <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                "{formErrors.email}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block uppercase text-sm tracking-widest mb-2">
                "COUNTRY CODE"
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
              >
                <option value="+57">CO +57</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block uppercase text-sm tracking-widest mb-2">
                "PHONE NUMBER"
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('phone')}
                  placeholder="3001234567"
                  className={`w-full p-3 bg-transparent border transition-all duration-200
                    ${formErrors.phone && touched.phone
                      ? 'border-red-500 bg-red-50/10'
                      : 'border-gray-300 focus:outline-none focus:border-black'}`}
                />

              </div>
              {formErrors.phone && touched.phone && (
                <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                  "{formErrors.phone}"
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block uppercase text-sm tracking-widest mb-2">
              "ADDRESS"
            </label>
            <div className="relative">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => handleBlur('address')}
                className={`w-full p-3 bg-transparent border transition-all duration-200 h-32
                  ${formErrors.address && touched.address
                    ? 'border-red-500 bg-red-50/10'
                    : 'border-gray-300 focus:outline-none focus:border-black'}`}
                placeholder="Ej: Carrera 45 # 20-10, Barrio El Poblado, Medellín"
              />

            </div>
            {formErrors.address && touched.address && (
              <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                "{formErrors.address}"
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

            </div>
            {formErrors.password && touched.password && (
              <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                "{formErrors.password}"
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block uppercase text-sm tracking-widest mb-2">
              "CONFIRM PASSWORD"
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full p-3 bg-transparent border transition-all duration-200
                  ${formErrors.confirmPassword && touched.confirmPassword
                    ? 'border-red-500 bg-red-50/10'
                    : 'border-gray-300 focus:outline-none focus:border-black'}`}
              />

            </div>
            {formErrors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-xs uppercase tracking-widest mt-1 animate-fade-in-up">
                "{formErrors.confirmPassword}"
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-black transition-all duration-200 ease-in-out mt-4"
          >
            {loading ? '"REGISTERING..."' : '"REGISTER"'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="uppercase text-sm tracking-widest text-gray-600">
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