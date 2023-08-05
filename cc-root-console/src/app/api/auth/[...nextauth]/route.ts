import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import {getHostConfig} from "@/config/host";

const config = getHostConfig()

const handler = NextAuth({
    providers: [
        // OAuth authentication providers...
        Email({
            server: {
                host: config.email.server.host,
                port: config.email.server.port,
                auth: {
                    user: config.email.server.auth.user,
                    pass: config.email.server.auth.password,
                }
            },
            from: config.email.from,
        }),
    ],
})

export { handler as GET, handler as POST }