'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

type NewUserModalProps = {
    isOpen: boolean
    onClose: () => void
    onUserCreated: () => void
}

export default function NewUserModal({ isOpen, onClose, onUserCreated }: NewUserModalProps) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: false,
        phone: '',
        address: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    // Añadir estados para validación
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        phone: false,
        address: false
    })
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    })

    const validateForm = () => {
        const errors = {
            name: '',
            email: '',
            password: '',
            phone: '',
            address: ''
        }
        let isValid = true

        // Validar nombre
        if (!form.name.trim()) {
            errors.name = 'Name is required'
            isValid = false
        }

        // Validar email
        if (!form.email.trim()) {
            errors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            errors.email = 'Invalid email format'
            isValid = false
        }

        // Validar contraseña
        if (!form.password) {
            errors.password = 'Password is required'
            isValid = false
        } else if (form.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        // Validar teléfono
        if (!form.phone.trim()) {
            errors.phone = 'Phone is required'
            isValid = false
        }

        // Validar dirección
        if (!form.address.trim()) {
            errors.address = 'Address is required'
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        
        // Marcar el campo como tocado
        if (!touched[name as keyof typeof touched]) {
            setTouched(prev => ({ ...prev, [name]: true }))
        }
    }

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateForm()
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setForm(prev => ({ ...prev, [name]: checked }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Marcar todos los campos como tocados
        setTouched({
            name: true,
            email: true,
            password: true,
            phone: true,
            address: true
        })
        
        // Validar antes de enviar
        if (!validateForm()) {
            return
        }
        
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to create user')
            }

            // Reset form
            setForm({
                name: '',
                email: '',
                password: '',
                isAdmin: false,
                phone: '',
                address: ''
            })
            
            // Reset validation states
            setTouched({
                name: false,
                email: false,
                password: false,
                phone: false,
                address: false
            })
            
            setFormErrors({
                name: '',
                email: '',
                password: '',
                phone: '',
                address: ''
            })

            // Notify parent component
            onUserCreated()
            onClose()
        } catch (err: any) {
            setError(err.message || 'Error creating user')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-black border-2 border-white/20 p-6 max-w-2xl w-full"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl uppercase">NEW USER</h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="hover:text-white/50"
                    >
                        <X className="h-5 w-5" />
                    </motion.button>
                </div>

                {error && (
                    <div className="bg-red-500/20 border-2 border-red-500 p-3 mb-6 text-center uppercase text-sm tracking-widest">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/70 text-sm uppercase mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                onBlur={() => handleBlur('name')}
                                className={`w-full bg-black border-2 ${
                                    formErrors.name && touched.name 
                                        ? 'border-red-500 bg-red-500/10' 
                                        : 'border-white/20'
                                } p-3 placeholder:text-white/30 transition-all duration-200 focus:border-white/60`}
                            />
                            {formErrors.name && touched.name && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm uppercase mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur('email')}
                                className={`w-full bg-black border-2 ${
                                    formErrors.email && touched.email 
                                        ? 'border-red-500 bg-red-500/10' 
                                        : 'border-white/20'
                                } p-3 placeholder:text-white/30 transition-all duration-200 focus:border-white/60`}
                            />
                            {formErrors.email && touched.email && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm uppercase mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                onBlur={() => handleBlur('password')}
                                className={`w-full bg-black border-2 ${
                                    formErrors.password && touched.password 
                                        ? 'border-red-500 bg-red-500/10' 
                                        : 'border-white/20'
                                } p-3 placeholder:text-white/30 transition-all duration-200 focus:border-white/60`}
                            />
                            {formErrors.password && touched.password && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm uppercase mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                onBlur={() => handleBlur('phone')}
                                className={`w-full bg-black border-2 ${
                                    formErrors.phone && touched.phone 
                                        ? 'border-red-500 bg-red-500/10' 
                                        : 'border-white/20'
                                } p-3 placeholder:text-white/30 transition-all duration-200 focus:border-white/60`}
                            />
                            {formErrors.phone && touched.phone && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-white/70 text-sm uppercase mb-1">Address</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                onBlur={() => handleBlur('address')}
                                className={`w-full bg-black border-2 ${
                                    formErrors.address && touched.address 
                                        ? 'border-red-500 bg-red-500/10' 
                                        : 'border-white/20'
                                } p-3 placeholder:text-white/30 h-24 transition-all duration-200 focus:border-white/60`}
                            />
                            {formErrors.address && touched.address && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={form.isAdmin}
                                    onChange={handleCheckboxChange}
                                    className="form-checkbox h-5 w-5 text-white border-white/20 rounded-none focus:ring-0"
                                />
                                <span className="text-white/70 text-sm uppercase">Admin User</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-white/20 hover:bg-white/10 transition-all duration-200"
                        >
                            CANCEL
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? 'CREATING...' : 'CREATE USER'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}