interface AppConfig {
    secret: string;
    environment: string;
}

export const getAppConfig = (): AppConfig => {
    const secret = process.env.SECRET;
    if (!secret) throw new Error("SECRET is not defined");

    const environment = process.env.ENVIRONMENT;
    if (!environment) throw new Error("ENVIRONMENT is not defined");

    return {
        secret,
        environment
    };
}

export const isTesting = (): boolean => {
    return getAppConfig().environment === "testing";
}

export const isNotTesting = (): boolean => {
    return !isTesting();
}

export const isProduction = (): boolean => {
    return getAppConfig().environment === "production";
}

export const isDevelopment = (): boolean => {
    return getAppConfig().environment === "development";
}