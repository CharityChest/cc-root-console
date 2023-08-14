import {logInfo} from "@/log";

export const sendAuthOtpEmail = async (email : string, otp: string) : Promise<boolean> => {
    // TODO: Implement this
    logInfo(`Sending OTP ${otp} to user's email (${email})`)
    return true
}