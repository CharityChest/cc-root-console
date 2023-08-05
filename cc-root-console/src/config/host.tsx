import { stripCharactersRight, stripCharacters, stripCharactersLeft } from '@/helper/string-library'

interface BackendHostConfig {
    host: string;
    port: number;
    baseUri: string;
    protocol: string;
    completeUrl: string;
}

interface EmailServerHostConfig {
    server: {
        host: string;
        port: number;
        auth: {
            user: string;
            password: string;
        }
    },
    from: string;
}

const buildEmailServerCompleteConfig = (): EmailServerHostConfig => {
    let emailServerHost = process.env.EMAIL_SERVER_HOST;
    let emailServerPort = process.env.EMAIL_SERVER_PORT;
    let emailServerUser = process.env.EMAIL_SERVER_USER;
    let emailServerPassword = process.env.EMAIL_SERVER_PASSWORD;
    let emailServerFrom = process.env.EMAIL_SERVER_FROM;

    emailServerHost = stripCharactersRight(emailServerHost, " /");
    emailServerPort = stripCharacters(emailServerPort, " ");
    emailServerUser = stripCharactersRight(emailServerUser, " /");
    emailServerPassword = stripCharactersRight(emailServerPassword, " /");
    emailServerFrom = stripCharacters(emailServerFrom, " ");

    if (!emailServerHost) throw new Error("EMAIL_SERVER_HOST is not defined");
    if (!emailServerPort) throw new Error("EMAIL_SERVER_PORT is not defined");
    if (!emailServerUser) throw new Error("EMAIL_SERVER_USER is not defined");
    if (!emailServerPassword) throw new Error("EMAIL_SERVER_PASSWORD is not defined");
    if (!emailServerFrom) throw new Error("EMAIL_SERVER_FROM is not defined");

    return {
        server: {
            host: emailServerHost,
            port: parseInt(emailServerPort),
            auth: {
                user: emailServerUser,
                password: emailServerPassword
            }
        },
        from: emailServerFrom
    }
}

export interface HostConfig {
    email: EmailServerHostConfig;
    backend: BackendHostConfig;
}

const buildBackendCompleteConfig = (): BackendHostConfig => {
    let backendHost = process.env.BACKEND_HOST;
    let backendPort = process.env.BACKEND_PORT;
    let backendProtocol = process.env.BACKEND_PROTOCOL;
    let backendBaseUri = process.env.BACKEND_BASE_URI;

    backendHost = stripCharactersRight(backendHost, " /");
    backendPort = stripCharacters(backendPort, " ");
    backendProtocol = stripCharactersRight(backendProtocol, " /");
    backendBaseUri = stripCharactersRight(backendBaseUri, " /");
    backendBaseUri = stripCharactersLeft(backendBaseUri, " /");

    if (!backendHost) throw new Error("BACKEND_HOST is not defined");
    if (!backendPort) throw new Error("BACKEND_PORT is not defined");
    if (!backendProtocol) throw new Error("BACKEND_PROTOCOL is not defined");
    if (!backendBaseUri) throw new Error("BACKEND_BASE_URI is not defined");

    const backendCompleteUrl = `${backendProtocol}://${backendHost}:${backendPort}/${backendBaseUri}`;

    return {
        host: backendHost,
        port: parseInt(backendPort),
        baseUri: backendBaseUri,
        protocol: backendProtocol,
        completeUrl: backendCompleteUrl
    };
}

export const getHostConfig = (): HostConfig => {
    return {
        email: buildEmailServerCompleteConfig(),
        backend: buildBackendCompleteConfig()
    };
}