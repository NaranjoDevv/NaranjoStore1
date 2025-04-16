'use client'

import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import useCartService from "@/lib/hooks/useCartStore"
import { useSession, signOut } from 'next-auth/react'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { items } = useCartService();
    const [mounted, setMounted] = useState(false);
    const { data: session } = useSession();
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        setMounted(true);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const cartItemsCount = mounted ? items.reduce((a, c) => a + c.qty, 0) : 0;

    // No renderizar nada hasta que el componente esté montado
    if (!mounted) return null;

    return (
        <header className={`sticky top-0 z-50 transition-all duration-200 ease-in-out
            ${isScrolled ? 'bg-black text-white shadow-xl' : 'bg-white text-black'}`}>
            <div className="navbar justify-between px-4 md:px-8 py-6">
                <Link href={'/'} className='text-2xl hover:line-through transition-all duration-200 ease-in-out'>
                    "NARANJO-STORE"
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-8 uppercase text-sm tracking-widest">

                    {session ? (
                        <>

                            <li className="relative">
                                <button
                                    onClick={toggleUserMenu}
                                    className="flex items-center uppercase tracking-widest hover:line-through transition-all duration-200 ease-in-out"
                                >
                                    {session.user.name || session.user.email}
                                    <span className="ml-1">{isUserMenuOpen ? '▲' : '▼'}</span>
                                </button>

                                {isUserMenuOpen && (
                                    <div
                                        ref={userMenuRef}
                                        className={`absolute top-full right-0 mt-2 w-48 py-2 
                                        ${isScrolled ? 'bg-black text-white' : 'bg-white text-black'} 
                                        shadow-xl z-50 border border-gray-200`}
                                    >
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 hover:bg-gray-100 hover:text-black uppercase text-sm tracking-widest"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            "PERFIL"
                                        </Link>

                                        {session.user.isAdmin && (
                                            <>
                                                <Link
                                                    href="/admin/products"
                                                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black uppercase text-sm tracking-widest"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    "PRODUCTOS"
                                                </Link>
                                                <Link
                                                    href="/admin/users"
                                                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black uppercase text-sm tracking-widest"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    "USUARIOS"
                                                </Link>
                                            </>
                                        )}

                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className='block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black uppercase text-sm tracking-widest'
                                        >
                                            "CERRAR SESIÓN"
                                        </button>
                                    </div>
                                )}
                            </li>

                            <li>
                                <Link href={'/cart'} className='hover:line-through transition-all duration-200 ease-in-out hover:text-white relative'>
                                    "CART"
                                    {mounted && cartItemsCount > 0 && (
                                        <span className={`absolute -top-0 -right-5 w-4 h-4 flex items-center justify-center text-xs
                                    ${isScrolled ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>

                            <li>
                                <Link href={'/cart'} className='hover:line-through transition-all duration-200 ease-in-out hover:text-white relative'>
                                    "CART"
                                    {mounted && cartItemsCount > 0 && (
                                        <span className={`absolute -top-0 -right-5 w-4 h-4 flex items-center justify-center text-xs
                                    ${isScrolled ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </Link>
                            </li>

                            <li>
                                <Link href={'/login'} className='hover:line-through transition-all duration-200 ease-in-out hover:text-white'>
                                    "LOGIN"
                                </Link>
                            </li>

                        </>

                    )}


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
                    {session && (
                        <div className="text-white text-xs uppercase tracking-widest mb-8">
                            {session.user.name || session.user.email}
                        </div>
                    )}
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
                                className='hover:line-through transition-all duration-200 ease-in-out relative'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                "CART"
                                {mounted && cartItemsCount > 0 && (
                                    <span className="absolute -top-2 -right-4 bg-white text-black w-4 h-4 flex items-center justify-center text-xs">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        {session ? (
                            <>
                                <li className="text-center">
                                    <Link
                                        href="/profile"
                                        className='hover:line-through transition-all duration-200 ease-in-out'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        "PROFILE"
                                    </Link>
                                </li>
                                {session.user.isAdmin && (
                                    <>
                                        <li className="text-center">
                                            <Link
                                                href="/admin/products"
                                                className='hover:line-through transition-all duration-200 ease-in-out'
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                "PRODUCTS"
                                            </Link>
                                        </li>
                                        <li className="text-center">
                                            <Link
                                                href="/admin/users"
                                                className='hover:line-through transition-all duration-200 ease-in-out'
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                "USERS"
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li className="text-center">
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className='hover:line-through transition-all duration-200 ease-in-out'
                                    >
                                        "LOG OUT"
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="text-center">
                                <Link
                                    href={'/login'}
                                    className='hover:line-through transition-all duration-200 ease-in-out'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    "LOGIN"
                                </Link>
                            </li>
                        )}
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
