'use client'

import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {SessionProvider} from "next-auth/react";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({
                                       children,
                                       session,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider session={session}>
            <html lang="en">
            <body className={inter.className}>{children}</body>
            </html>
        </SessionProvider>
    )
}
