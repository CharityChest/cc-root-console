import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { userService } from '@/service/user.service';
import {authRoutes} from "@/route/local";

const Layout: React.FC<{ children: React.ReactNode}> = function Layout({ children }) {
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (userService.userValue) {
            router.push(authRoutes.root);
        }
    }, [router]);

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            {children}
        </div>
    );
}

export { Layout };