'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toast from "@/components/ui/Toast";
import { SessionProvider } from "next-auth/react";
import ClientLayout from "@/components/ClientLayout";
import Header from "@/components/header/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toast />
        </SessionProvider>
      </body>
    </html>
  );
}

