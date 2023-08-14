interface AppConfig {
    secret: string;
}

export const getAppConfig = (): AppConfig => {
    const secret = process.env.SECRET;
    if (!secret) throw new Error("SECRET is not defined");

    return {
        secret
    };
}