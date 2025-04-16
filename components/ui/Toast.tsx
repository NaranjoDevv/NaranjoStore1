'use client'

import { notificationStore } from '@/lib/hooks/useCartStore'
import { useEffect, useState } from 'react'

export default function Toast() {
    const { message, isVisible, hideNotification } = notificationStore()
    const [isExiting, setIsExiting] = useState(false)
    const [isEntering, setIsEntering] = useState(true)

    useEffect(() => {
        if (isVisible) {
            // Start with entering animation
            setIsExiting(false)
            setIsEntering(true)

            // Remove entering state after a short delay
            const enterTimer = setTimeout(() => {
                setIsEntering(false)
            }, 300)

            // Start the exit animation after 1.7 seconds
            const exitTimer = setTimeout(() => {
                setIsExiting(true)
            }, 1700)

            // Hide the notification after 2 seconds
            const hideTimer = setTimeout(() => {
                hideNotification()
            }, 2000)

            return () => {
                clearTimeout(enterTimer)
                clearTimeout(exitTimer)
                clearTimeout(hideTimer)
            }
        }
    }, [isVisible, hideNotification])

    if (!isVisible) return null

    return (
        <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ease-in-out
      ${isEntering ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}
      ${isExiting ? 'opacity-0 transform translate-y-4' : ''}`}>
            <div className="bg-black text-white py-4 px-6 font-mono tracking-tighter uppercase text-sm border border-white shadow-lg">
                {message}
            </div>
        </div>
    )
}