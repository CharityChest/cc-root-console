import {hash} from "@/helper/server/string-server-library";

interface AuthElement {
    username: string;
    password: string;
    email: string;
}

interface AuthConfig {
    entries: AuthElement[];
}

const buildAuthConfig = (): AuthConfig => {
    // AUTH_ENTRIES is a string of the form "username1:password1:username1@email.com@password;username2:password2:username2@email.com;username3:password3:username3@email.com"
    let authEntries = process.env.AUTH_ENTRIES;

    if (!authEntries) throw new Error("AUTH_ENTRIES is not defined");

    const authEntriesArray : string[] = authEntries.split(";");

    const authElements: AuthElement[] = authEntriesArray.map((entry : string ): AuthElement => {
        const entryArray: string[] = entry.split(":");
        if (entryArray.length !== 3) throw new Error("AUTH_ENTRIES is not valid");

        const username : string = entryArray[0];
        const password : string = entryArray[1];
        const email : string = entryArray[2];

        if(!username) throw new Error("AUTH_ENTRIES is not valid");
        if(!password) throw new Error("AUTH_ENTRIES is not valid");
        if(!email) throw new Error("AUTH_ENTRIES is not valid");

        return {
            username,
            password,
            email
        };
    });

    return {
        entries: authElements
    };
}

export const hashPassword = (password : string, username : string): string => {
    return hash(password, username);
}

export const ifAuthorizedReturnEmail = (username : string, password : string): string|null => {
    const authConfig : AuthConfig = buildAuthConfig();

    const authEntry : AuthElement | undefined = authConfig.entries.find(
        (entry : AuthElement) : boolean => {
            const passwd : string = hashPassword(password, entry.username);
            return entry.username === username && passwd === entry.password
        }
    );
    return authEntry !== undefined ? authEntry.email : null;
}