'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'  // Remove 'update' from here
import { useRouter } from 'next/navigation'



export default function ProfilePage() {
    const { data: session, status, update } = useSession() // Add update here
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [countryCode, setCountryCode] = useState('+57')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')

    useEffect(() => {


        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (session?.user) {
            setName(session.user.name || '')
            setEmail(session.user.email || '')
            // Initialize phone and address from session
            const fullPhone = session.user.phone || '+57'
            setCountryCode(fullPhone.substring(0, 3))
            setPhoneNumber(fullPhone.substring(3))
            setAddress(session.user.address || '')
        }
    }, [session, status, router])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (password && password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    ...(password && { password }),
                    phone: `${countryCode}${phoneNumber}`,
                    address
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Failed to update profile')
            } else {
                // Actualizar la sesión y forzar recarga
                await update({
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone,
                    address: data.user.address
                })

                // Añadir mensaje de éxito
                setSuccess('Profile updated successfully!')

                // Limpiar campos de contraseña
                setPassword('')
                setConfirmPassword('')

                // Forzar actualización de la sesión en la UI
                setTimeout(() => {
                    window.location.reload()
                }, 1000) // Esperar 1 segundo para que el usuario vea el mensaje de éxito
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-mono tracking-tighter uppercase">"LOADING..."</div>
            </div>
        )
    }

    if (!session) {
        // Should be redirected by useEffect, but added as a fallback
        return null
    }

    return (
        <div className="py-8 font-mono tracking-tighter">
            <h1 className="text-3xl uppercase mb-8 text-center">"PROFILE"</h1>

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
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block uppercase text-sm tracking-widest mb-2">
                            "EMAIL"
                        </label>
                        <input
                            disabled
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="3001234567"
                                className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block uppercase text-sm tracking-widest mb-2">
                            Dirección
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black h-32"
                            placeholder="Ej: Carrera 45 # 20-10, Barrio El Poblado, Medellín"
                            required
                        />
                    </div>

                    <hr className="border-gray-300 my-6" />

                    <h2 className="text-xl uppercase tracking-widest text-center">"CHANGE PASSWORD"</h2>

                    <div>
                        <label htmlFor="password" className="block uppercase text-sm tracking-widest mb-2">
                            "NEW PASSWORD"
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block uppercase text-sm tracking-widest mb-2">
                            "CONFIRM NEW PASSWORD"
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-black transition-all duration-200 ease-in-out disabled:opacity-50"
                    >
                        {loading ? '"UPDATING..."' : '"UPDATE PROFILE"'}
                    </button>
                </form>
            </div>
        </div>
    )
}
