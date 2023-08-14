import Cookies from 'cookies';
import {getAppConfig} from "@/config/server/app";

const secret = getAppConfig().secret

interface SetOptions {
    signed?: true;
    expires?: Date;
    maxAge?: number;
}

export const signedCookie = (req : Request, res : Response) => {
    const cookies = new Cookies(req, res, {keys: [secret]})
    return {
        get: (key: string, defaultValue: string | null = null): string | null => {
            return cookies.get(key, { signed: true }) ?? defaultValue
        },
        set: (key: string, value: string, options: SetOptions = {}): void => {
            options.signed = true
            cookies.set(key, value, options)
        },
        del: (key: string): void => {
            cookies.set(key, null, {signed: true})
        }
    }
}