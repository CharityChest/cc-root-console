import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {del, get, set} from "@/library/server/redis";
import {ifAuthorizedReturnEmail} from "@/config/server/auth";
import {randomUnsafe} from "@/helper/string-library";
import {sendAuthOtpEmail} from "@/modules/email";
import {hash} from "@/helper/server/string-server-library";
import {logDebug} from "@/log";
import {NextApiRequest, NextApiResponse} from "next";
import {signedCookie} from "@/library/server/cookie";
import {authRoutes} from "@/route/local";

const handler = (req: NextApiRequest, res : NextApiResponse) => {
    if (req.method === 'GET') {
        const username = JSON.parse(
            signedCookie(req as Request, res as Response).get("auth") ?? "{}"
        ).username
        if (username) {
            res.redirect(authRoutes.welcome)
            return
        }
    }
    const credentialsProvider = CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            username: { label: "Username", type: "text", placeholder: "Username" },
            password: { label: "Password", type: "password" },
            otp: { label: "OTP", type: "text", value: "" },
        },
        async authorize(credentials) {
            logDebug("Auth procedure begun", credentials)

            const { username, password, otp } = credentials

            const email :string|null = ifAuthorizedReturnEmail(username, password)
            logDebug("Email", email)
            if(email === null) {
                return null
            }

            const rotp = await get(username, password, "otp")

            logDebug("OTP", rotp)

            if(rotp === null) {
                const randomOtp = randomUnsafe(8)
                if(await set(username, password, "otp", randomOtp, 60 * 5)){
                    logDebug("OTP set")
                    if(!await sendAuthOtpEmail(email, randomOtp)){
                        await del(username, password, "otp")
                    }
                    return null
                }
            }


            if (rotp !== otp) {
                return null
            }

            await del(username, password, "otp")

            signedCookie(req as Request, res as Response)
                .set("auth", JSON.stringify({username}), {maxAge: 60 * 60 * 24 * 7})

            return  {
                id: hash(username, password),
                name: username,
                email,
            }
        }
    })
    return NextAuth(req, res,{
        providers: [
            credentialsProvider,
        ],
    })
}

export const GET = handler

export const POST = handler