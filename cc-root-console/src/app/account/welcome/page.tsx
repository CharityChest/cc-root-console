'use client'

import React from 'react';
import {Layout} from '@/component/account';
import { useSession, signIn, signOut } from "next-auth/react"

const Welcome: React.FC = () => {
    const { data: session } = useSession()
    if(session){
        return (
            <>
                Signed in as {session.user?.email} <br/>
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
}

export default Welcome;