'use client'

import React from 'react';
import {authRoutes} from "@/route/local";
import { useSession, signIn, signOut } from "next-auth/react"

const Layout: React.FC<{ children: React.ReactNode}> = function Layout({ children }) {
    const { data: session } = useSession()

    if(session){
        return (
            <>
                Signed in as {session.user?.email} <br/>
                <button onClick={() => signOut()}>Sign out</button>
                <div>
                    {children}
                </div>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}

export { Layout };