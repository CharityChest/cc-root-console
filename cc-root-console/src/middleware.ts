import {authRoutes} from "@/route/local";
import {getAppConfig} from "@/config/server/app";

export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        authRoutes.welcome,
    ],
}