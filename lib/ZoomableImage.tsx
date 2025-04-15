'use client'

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

interface ZoomableImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export default function ZoomableImage({ src, alt, width, height }: ZoomableImageProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        setPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    return (
        <div
            ref={imageRef}
            className="relative bg-gradient-to-b from-white to-gray-300 p-4 overflow-hidden cursor-crosshair aspect-square"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="w-full h-full transition-transform duration-200 ease-out"
                style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${position.x * 100}% ${position.y * 100}%`
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="object-cover w-full h-full"
                />
            </div>
        </div>
    );
}