import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {del, get, set} from "@/library/server/redis";
import {ifAuthorizedReturnEmail} from "@/config/server/auth";
import {randomUnsafe} from "@/helper/string-library";
import {sendAuthOtpEmail} from "@/modules/email";
import {hash} from "@/helper/server/string-server-library";
import {NextRequest, NextResponse} from "next/server";
import {NextApiRequest, NextApiResponse} from "next";
import {isNotTesting} from "@/config/server/app";

const handler = (req: NextRequest, res : NextResponse) => {
    const credentialsProvider = CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text", placeholder: "Username" },
            password: { label: "Password", type: "password" },
            otp: { label: "OTP", type: "text", value: "" },
        },
        async authorize(credentials) {
            const { username, password, otp } = credentials

            const email :string|null = ifAuthorizedReturnEmail(username, password)
            if(email === null) {
                return null
            }

            const rotp = await get(username, password, "otp")

            const checkOtp : boolean = isNotTesting()

            if(rotp === null && checkOtp){
                const randomOtp = randomUnsafe(8)
                if(await set(username, password, "otp", randomOtp, 60 * 5)){
                    if(!await sendAuthOtpEmail(email, randomOtp)){
                        await del(username, password, "otp")
                    }
                    return null
                }
            }


            if (rotp !== otp && checkOtp) {
                return null
            }

            checkOtp && await del(username, password, "otp")

            return  {
                id: hash(username, password),
                name: username,
                email,
            }
        },
    })
    return NextAuth( req as NextApiRequest, res as NextApiResponse,{
        providers: [
            credentialsProvider,
        ],
    })
}

export const GET = handler

export const POST = handler