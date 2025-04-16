'use client'

import { useState, useEffect } from 'react';
import Header from "@/components/header/header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Don't render anything until client-side rendering is complete
    if (!isLoaded) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            {children}
            <footer className="py-8 mt-16 font-mono tracking-tighter text-center">
                <p className="uppercase text-sm">
                    "©  NARANJO INDUSTRIES 2025 "
                </p>
            </footer>
        </div>
    );
}