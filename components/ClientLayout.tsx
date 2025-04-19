'use client'

import { useState, useEffect } from 'react';
import Header from "@/components/header/header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        
        // Detectar si es dispositivo móvil
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Don't render anything until client-side rendering is complete
    if (!isLoaded) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className={`flex-grow container mx-auto px-4 ${isMobile ? 'mobile-py' : 'py-8'}`}>
                {children}
            </main>
            <footer className="py-6 md:py-8 mt-8 md:mt-16 font-mono tracking-tighter text-center border-t border-gray-100">
                <p className="uppercase text-sm">
                    "©  NARANJO INDUSTRIES 2025 "
                </p>
            </footer>
        </div>
    );
}