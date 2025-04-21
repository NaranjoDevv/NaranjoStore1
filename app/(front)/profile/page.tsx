"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface FormData {
    name: string
    email: string
    password: string
    confirmPassword: string
    countryCode: string
    phoneNumber: string
    address: string
}

interface FieldErrors {
    [key: string]: string
}

interface Message {
    error: string
    success: string
}

interface InputFieldProps {
    label: string
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    disabled?: boolean
    placeholder?: string
}

export default function ProfilePage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const [form, setForm] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        countryCode: '+57',
        phoneNumber: '',
        address: '',
    })

    const [message, setMessage] = useState<Message>({ error: '', success: '' })
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        if (session?.user) {
            setForm({
                name: session.user.name || '',
                email: session.user.email || '',
                password: '',
                confirmPassword: '',
                countryCode: (session.user.phone || '+57').slice(0, 3),
                phoneNumber: (session.user.phone || '').slice(3),
                address: session.user.address || '',
            })
        }
    }, [session, status, router])

    const handleChange = (field: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const validateForm = (): FieldErrors => {
        const errors: FieldErrors = {}
        if (!/^[0-9]{10}$/.test(form.phoneNumber)) {
            errors.phoneNumber = 'El número debe tener 10 dígitos.'
        }
        if (form.password && form.password !== form.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden.'
        }
        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFieldErrors({})
        setMessage({ error: '', success: '' })
        setLoading(true)

        const errors = validateForm()
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    ...(form.password && { password: form.password }),
                    phone: `${form.countryCode}${form.phoneNumber}`,
                    address: form.address,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Error al actualizar el perfil')

            await update({
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone,
                address: data.user.address,
            })

            setMessage({ success: 'Perfil actualizado exitosamente.', error: '' })
            setForm(prev => ({ ...prev, password: '', confirmPassword: '' }))
        } catch (err: any) {
            setMessage({ error: err.message || 'Error de servidor', success: '' })
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-mono tracking-tighter uppercase">LOADING...</div>
            </div>
        )
    }

    if (!session) return null

    return (
        <div className="py-8 px-4 font-mono tracking-tighter">
            <h1 className="text-3xl uppercase mb-8 text-center">PROFILE</h1>
            <div className="max-w-md mx-auto">
                {message.error && (
                    <div className="bg-red-500 text-white p-3 mb-4 text-center uppercase text-sm tracking-widest">
                        {message.error}
                    </div>
                )}
                {message.success && (
                    <div className="bg-green-600 text-white p-3 mb-4 text-center uppercase text-sm tracking-widest">
                        {message.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <InputField
                        label="Name"
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                    />

                    <InputField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block uppercase text-sm mb-2">Código País</label>
                            <select
                                value={form.countryCode}
                                onChange={(e) => handleChange('countryCode', e.target.value)}
                                className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-gray-700"
                            >
                                <option value="+57">CO +57</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block uppercase text-sm mb-2">Número celular</label>
                            <input
                                type="tel"
                                value={form.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                                placeholder="3001234567"
                                className={`w-full p-3 bg-transparent border ${fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-700`}
                            />
                            {fieldErrors.phoneNumber && (
                                <p className="mt-1 text-xs uppercase text-red-500 tracking-wide">{fieldErrors.phoneNumber}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block uppercase text-sm mb-2">Dirección</label>
                        <textarea
                            value={form.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-gray-700 h-32"
                            placeholder="Carrera 45 # 20-10, Barrio El Poblado"
                            required
                        />
                    </div>

                    <hr className="border-gray-300 my-6" />

                    <h2 className="text-xl uppercase tracking-widest text-center">CHANGE PASSWORD</h2>

                    <InputField
                        label="New Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="Opcional"
                    />

                    <div>
                        <label className="block uppercase text-sm mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            className={`w-full p-3 bg-transparent border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-700`}
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="mt-1 text-xs uppercase text-red-500 tracking-wide">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-black transition-all duration-200 ease-in-out disabled:opacity-50"
                    >
                        {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
                    </button>
                </form>
            </div>
        </div>
    )
}

function InputField({ label, type, value, onChange, required = false, disabled = false, placeholder = '' }: InputFieldProps) {
    return (
        <div>
            <label className="block uppercase text-sm mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full p-3 bg-transparent border border-gray-300 focus:outline-none focus:border-gray-700 disabled:opacity-50"
            />
        </div>
    )
}