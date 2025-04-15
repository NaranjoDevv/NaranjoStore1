'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`sticky top-0 z-50 transition-all duration-200 ease-in-out
            ${isScrolled ? 'bg-black text-white shadow-xl' : 'bg-white text-black'}`}>
            <div className="navbar justify-between px-4 md:px-8 py-6">
                <Link href={'/'} className='text-2xl hover:line-through transition-all duration-200 ease-in-out'>
                    "NARANJO-STORE"
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-8 uppercase text-sm tracking-widest">
                    <li>
                        <Link href={'/cart'} className='hover:line-through transition-all duration-200 ease-in-out hover:text-white'>
                            "CART"
                        </Link>
                    </li>
                    <li>
                        <Link href={'/login'} className='hover:line-through transition-all duration-200 ease-in-out hover:text-white'>
                            "LOGIN"
                        </Link>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden font-mono uppercase text-sm tracking-widest"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? '"CLOSE"' : '"MENU"'}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out z-40 
                ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

                <div className={`h-full w-full flex flex-col justify-center items-center transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <ul className="flex flex-col gap-8 uppercase text-xl tracking-widest text-white font-mono">
                        <li className="text-center">
                            <Link
                                href={'/'}
                                className='hover:line-through transition-all duration-200 ease-in-out'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                "HOME"
                            </Link>
                        </li>
                        <li className="text-center">
                            <Link
                                href={'/cart'}
                                className='hover:line-through transition-all duration-200 ease-in-out'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                "CART"
                            </Link>
                        </li>
                        <li className="text-center">
                            <Link
                                href={'/login'}
                                className='hover:line-through transition-all duration-200 ease-in-out'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                "LOGIN"
                            </Link>
                        </li>
                    </ul>

                    {/* Close Button Centered at Bottom */}
                    <button
                        className="absolute bottom-12 font-mono text-white text-xl tracking-widest hover:line-through transition-all duration-200 ease-in-out cursor-pointer mt-12"
                        onClick={toggleMenu}
                    >
                        "CLOSE"
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header