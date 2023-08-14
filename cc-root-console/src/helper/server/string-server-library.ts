import crypto from "crypto";

export const hash = (password : string, salt : string = "", encoding: BufferEncoding = "hex"): string => {
    return crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha512'
    ).toString(encoding);
}