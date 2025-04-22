'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, Edit, Trash2, Plus, X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import NewUserModal from './NewUserModal'

type User = {
    _id: string
    name: string
    email: string
    isAdmin: boolean
    phone?: string
    address?: string
}

export default function UsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        isAdmin: false,
        phone: '',
        address: ''
    })
    // Añadir estados para validación de formulario de edición
    const [editFormErrors, setEditFormErrors] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })
    const [editFormTouched, setEditFormTouched] = useState({
        name: false,
        email: false,
        phone: false,
        address: false
    })
    const [showNewUserModal, setShowNewUserModal] = useState(false)
    const [isTableVisible, setIsTableVisible] = useState(false)

    // Referencia para evitar el scroll automático
    const pageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchUsers()

        // Prevenir scroll automático
        document.body.style.overflow = 'auto'
        document.documentElement.scrollTop = 0

        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/users')
            if (!response.ok) {
                throw new Error('Failed to fetch users')
            }
            const data = await response.json()
            setUsers(data.users)
            // Activar animación de tabla después de cargar datos
            setTimeout(() => setIsTableVisible(true), 100)
        } catch (err) {
            setError('Error loading users')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user)
        setShowDeleteModal(true)
    }

    // Función para validar el formulario de edición
    const validateEditForm = () => {
        const errors = {
            name: '',
            email: '',
            phone: '',
            address: ''
        }
        let isValid = true

        // Validar nombre
        if (!editForm.name.trim()) {
            errors.name = 'Name is required'
            isValid = false
        }

        // Validar email
        if (!editForm.email.trim()) {
            errors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
            errors.email = 'Invalid email format'
            isValid = false
        }

        // Validar teléfono
        if (!editForm.phone.trim()) {
            errors.phone = 'Phone is required'
            isValid = false
        }

        // Validar dirección
        if (!editForm.address.trim()) {
            errors.address = 'Address is required'
            isValid = false
        }

        setEditFormErrors(errors)
        return isValid
    }

    const handleEditClick = (user: User) => {
        setUserToEdit(user)
        setEditForm({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phone: user.phone || '',
            address: user.address || ''
        })
        // Resetear estados de validación
        setEditFormTouched({
            name: false,
            email: false,
            phone: false,
            address: false
        })
        setEditFormErrors({
            name: '',
            email: '',
            phone: '',
            address: ''
        })
        setShowEditModal(true)
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        try {
            const response = await fetch(`/api/admin/users/${userToDelete._id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete user')
            }

            // Refresh users list
            fetchUsers()
            setShowDeleteModal(false)
        } catch (err) {
            setError('Error deleting user')
            console.error(err)
        }
    }

    // Añadir función para manejar cambios en los campos del formulario
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))

        // Marcar el campo como tocado
        if (!editFormTouched[name as keyof typeof editFormTouched]) {
            setEditFormTouched(prev => ({ ...prev, [name]: true }))
        }
    }

    // Añadir función para manejar cuando un campo pierde el foco
    const handleEditFormBlur = (field: string) => {
        setEditFormTouched(prev => ({ ...prev, [field]: true }))
        validateEditForm()
    }

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userToEdit) return

        // Marcar todos los campos como tocados
        setEditFormTouched({
            name: true,
            email: true,
            phone: true,
            address: true
        })

        // Validar antes de enviar
        if (!validateEditForm()) {
            return
        }

        try {
            const response = await fetch(`/api/admin/users/${userToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to update user')
            }

            // Refresh users list
            fetchUsers()
            setShowEditModal(false)
        } catch (err: any) {
            setError(err.message || 'Error updating user')
            console.error(err)
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-mono tracking-tighter uppercase flex items-center"
                >
                    <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        "LOADING USERS..."
                    </motion.span>
                </motion.div>
            </div>
        )
    }

    return (
        <div
            ref={pageRef}
            className="text-white p-2 sm:p-4 font-mono tracking-tighter overflow-x-hidden overflow-y-auto"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 border-b border-white/20 pb-4 gap-4"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl uppercase flex items-center gap-2 sm:gap-3">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                        [USERS MANAGEMENT]
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowNewUserModal(true)}
                        className="flex items-center gap-2 bg-white text-black px-3 py-1 sm:px-4 sm:py-2 hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-300 text-sm sm:text-base"
                    >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        NEW USER
                    </motion.button>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/20 border-2 border-red-500 p-3 mb-6 text-center uppercase text-sm tracking-widest flex items-center justify-center gap-2"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {error}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setError('')}
                                className="ml-2 hover:text-white/50"
                            >
                                <X className="h-4 w-4" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mb-6 relative"
                >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <input
                        type="text"
                        placeholder="SEARCH USERS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border-2 border-white/20 p-3 pl-10 placeholder:text-white/30 focus:border-white/60 transition-all duration-300"
                    />
                </motion.div>

                {/* Tabla para pantallas medianas y grandes */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isTableVisible ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-x-auto -mx-2 sm:mx-0 hidden md:block"
                >
                    <table className="w-full border-collapse min-w-[640px]">
                        <thead>
                            <tr className="border-b-2 border-white/20">
                                <th className="text-left p-2 sm:p-3 uppercase tracking-wider text-xs sm:text-sm">ID</th>
                                <th className="text-left p-2 sm:p-3 uppercase tracking-wider text-xs sm:text-sm">Name</th>
                                <th className="text-left p-2 sm:p-3 uppercase tracking-wider text-xs sm:text-sm">Email</th>
                                <th className="text-left p-2 sm:p-3 uppercase tracking-wider text-xs sm:text-sm">Admin</th>
                                <th className="text-left p-2 sm:p-3 uppercase tracking-wider text-xs sm:text-sm hidden md:table-cell">Phone</th>
                                <th className="text-right p-2 sm:p-3 uppercase tracking-wider text-xs sm:text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-white/50">No users found</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        className="border-b border-white/10 hover:bg-white/5"
                                    >
                                        <td className="p-2 sm:p-3 font-light text-white/70 text-xs sm:text-sm">{user._id.substring(0, 6)}...</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.name}</td>
                                        <td className="p-2 sm:p-3 font-light text-white/70 text-xs sm:text-sm">{user.email}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                            {user.isAdmin ? (
                                                <span className="bg-white/20 text-white px-1 sm:px-2 py-1 text-xs">ADMIN</span>
                                            ) : (
                                                <span className="bg-white/5 text-white/50 px-1 sm:px-2 py-1 text-xs">USER</span>
                                            )}
                                        </td>
                                        <td className="p-2 sm:p-3 font-light text-white/70 text-xs sm:text-sm hidden md:table-cell">{user.phone || '-'}</td>
                                        <td className="p-2 sm:p-3 text-right">
                                            <div className="flex justify-end gap-1 sm:gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-1 sm:p-2 hover:bg-white/10 transition-colors rounded-sm"
                                                >
                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="p-1 sm:p-2 hover:bg-red-500/20 transition-colors rounded-sm"
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>

                {/* Tarjetas para dispositivos móviles */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isTableVisible ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="md:hidden space-y-4"
                >
                    {filteredUsers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center p-4 text-white/50 border border-white/10"
                        >
                            No users found
                        </motion.div>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                className="border border-white/20 p-4 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-medium text-sm">{user.name}</h3>
                                        <p className="text-white/70 text-xs">{user.email}</p>
                                    </div>
                                    <div>
                                        {user.isAdmin ? (
                                            <span className="bg-white/20 text-white px-2 py-1 text-xs">ADMIN</span>
                                        ) : (
                                            <span className="bg-white/5 text-white/50 px-2 py-1 text-xs">USER</span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                    <div>
                                        <p className="text-white/50 uppercase">ID</p>
                                        <p className="font-light text-white/70">{user._id.substring(0, 6)}...</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50 uppercase">Phone</p>
                                        <p className="font-light text-white/70">{user.phone || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEditClick(user)}
                                        className="p-2 hover:bg-white/10 transition-colors rounded-sm"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteClick(user)}
                                        className="p-2 hover:bg-red-500/20 transition-colors rounded-sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Delete Modal */}
                <AnimatePresence>
                    {showDeleteModal && userToDelete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    setShowDeleteModal(false)
                                }
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-black border-2 border-white/20 p-6 max-w-md w-full mx-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl uppercase">DELETE USER</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowDeleteModal(false)}
                                        className="hover:text-white/50"
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.button>
                                </div>
                                <p className="mb-6">
                                    Are you sure you want to delete user <span className="font-bold">{userToDelete.name}</span>?
                                    This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowDeleteModal(false)}
                                        className="px-4 py-2 border border-white/20 hover:bg-white/10 transition-all duration-200"
                                    >
                                        CANCEL
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDeleteUser}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                                    >
                                        DELETE
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Modal */}
                <AnimatePresence>
                    {showEditModal && userToEdit && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-auto"
                            onClick={(e) => {
                                // Cerrar modal al hacer clic fuera del formulario
                                if (e.target === e.currentTarget) {
                                    setShowEditModal(false)
                                }
                            }}
                        >
                            <form
                                onSubmit={handleEditUser}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-black border-2 border-white/20 p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-auto my-4 sm:my-auto"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl uppercase">EDIT USER</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="hover:text-white/50"
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-white/70 text-sm uppercase mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditFormChange}
                                                onBlur={() => handleEditFormBlur('name')}
                                                className={`w-full bg-black border-2 ${editFormErrors.name && editFormTouched.name
                                                    ? 'border-red-500 bg-red-500/10'
                                                    : 'border-white/20'
                                                    } p-3 placeholder:text-white/30 transition-all duration-200 focus:border-white/60`}
                                                required
                                            />
                                            {editFormErrors.name && editFormTouched.name && (
                                                <p className="text-red-500 text-xs mt-1">{editFormErrors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-white/70 text-sm uppercase mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                disabled
                                                value={editForm.email}
                                                onChange={handleEditFormChange}
                                                onBlur={() => handleEditFormBlur('email')}
                                                className={`w-full bg-black border-2 ${editFormErrors.email && editFormTouched.email
                                                    ? 'border-red-500 bg-red-500/10'
                                                    : 'border-white/20'
                                                    } p-3 placeholder:text-white/30 transition-all duration-200 focus:border-white/60`}
                                                required
                                            />
                                            {editFormErrors.email && editFormTouched.email && (
                                                <p className="text-red-500 text-xs mt-1">{editFormErrors.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-white/70 text-sm uppercase mb-1">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={editForm.phone}
                                                onChange={handleEditFormChange}
                                                onBlur={() => handleEditFormBlur('phone')}
                                                className={`w-full bg-black border-2 ${editFormErrors.phone && editFormTouched.phone
                                                    ? 'border-red-500 bg-red-500/10'
                                                    : 'border-white/20'
                                                    } p-3 placeholder:text-white/30 transition-all duration-200 focus:border-white/60`}
                                            />
                                            {editFormErrors.phone && editFormTouched.phone && (
                                                <p className="text-red-500 text-xs mt-1">{editFormErrors.phone}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-white/70 text-sm uppercase mb-1">Address</label>
                                            <textarea
                                                name="address"
                                                value={editForm.address}
                                                onChange={handleEditFormChange}
                                                onBlur={() => handleEditFormBlur('address')}
                                                className={`w-full bg-black border-2 ${editFormErrors.address && editFormTouched.address
                                                    ? 'border-red-500 bg-red-500/10'
                                                    : 'border-white/20'
                                                    } p-3 placeholder:text-white/30 h-24 transition-all duration-200 focus:border-white/60`}
                                            />
                                            {editFormErrors.address && editFormTouched.address && (
                                                <p className="text-red-500 text-xs mt-1">{editFormErrors.address}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.isAdmin}
                                                    onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
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
                                            onClick={() => setShowEditModal(false)}
                                            className="px-4 py-2 border border-white/20 hover:bg-white/10 transition-all duration-200"
                                        >
                                            CANCEL
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            className="px-4 py-2 bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-300"
                                        >
                                            UPDATE USER
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* New User Modal Component */}
                <AnimatePresence>
                    {showNewUserModal && (
                        <NewUserModal
                            isOpen={showNewUserModal}
                            onClose={() => setShowNewUserModal(false)}
                            onUserCreated={fetchUsers}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}