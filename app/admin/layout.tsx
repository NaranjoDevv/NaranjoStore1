'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Si la sesión está cargada (ya no está en estado "loading")
    if (status !== 'loading') {
      // Verificar si el usuario está autenticado y es administrador
      if (!session || !session.user?.isAdmin) {
        // Redirigir a la página principal si no es admin
        router.push('/')
      } else {
        // Si es admin, mostrar el contenido
        setLoading(false)
      }
    }
  }, [session, status, router])

  // Mostrar pantalla de carga mientras se verifica la sesión
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
            "VERIFICANDO PERMISOS..."
          </motion.span>
        </motion.div>
      </div>
    )
  }

  // Renderizar el contenido de administración si el usuario está autenticado y es admin
  return <>{children}</>
}