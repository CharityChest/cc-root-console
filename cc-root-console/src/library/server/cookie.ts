import {cookies} from 'next/headers'
import {hash} from "@/helper/server/string-server-library";
import {getAppConfig} from "@/config/server/app";

const secret = getAppConfig().secret

interface SetOptions {
    signed?: boolean;
    expires?: Date;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
}

interface Cookie {
    value: string;
    signature?: string;
}

export const cookie = () => {
    const cookieStore = cookies()
    return {
        get: (key: string, defaultValue: string | null = null): string | null => {
            const data = cookieStore.get(key as any)?.value
            if (!data) {
                return defaultValue
            }
            const cookie : Cookie = JSON.parse(data as string)
            if (cookie.signature) {
                if (cookie.signature !== hash(secret, cookie.value)) {
                    return defaultValue
                }
            }
            return cookie.value
        },
        set: (key: string, value: string, options: SetOptions = {signed: true}): void => {
            const data : Cookie = {
                value
            };
            if (options.signed) {
                data.signature = hash(secret, value)
            }
            cookieStore.set(key as any, JSON.stringify(data) as any, options as any)
        },
        del: (key: string): void => {
            cookieStore.delete(key as any)
        }
    }
}