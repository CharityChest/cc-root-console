import { stripCharactersRight, stripCharacters, stripCharactersLeft } from '@/helper/string-library'

interface BackendHostConfig {
    host: string;
    port: number;
    baseUri: string;
    protocol: string;
    completeUrl: string;
}

export interface HostConfig {
    backend: BackendHostConfig;
}

export const getHostConfig = (): HostConfig => {
    let backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST;
    let backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT;
    let backendProtocol = process.env.NEXT_PUBLIC_BACKEND_PROTOCOL;
    let backendBaseUri = process.env.NEXT_PUBLIC_BACKEND_BASE_URI;

    backendHost = stripCharactersRight(backendHost, " /");
    backendPort = stripCharacters(backendPort, " ");
    backendProtocol = stripCharactersRight(backendProtocol, " /");
    backendBaseUri = stripCharactersRight(backendBaseUri, " /");
    backendBaseUri = stripCharactersLeft(backendBaseUri, " /");

    if (!backendHost) throw new Error("NEXT_PUBLIC_BACKEND_HOST is not defined");
    if (!backendPort) throw new Error("NEXT_PUBLIC_BACKEND_PORT is not defined");
    if (!backendProtocol) throw new Error("NEXT_PUBLIC_BACKEND_PROTOCOL is not defined");
    if (!backendBaseUri) throw new Error("NEXT_PUBLIC_BACKEND_BASE_URI is not defined");

    const backendCompleteUrl = `${backendProtocol}://${backendHost}:${backendPort}/${backendBaseUri}`;

    const backendHostConfig: BackendHostConfig = {
        host: backendHost,
        port: parseInt(backendPort),
        baseUri: backendBaseUri,
        protocol: backendProtocol,
        completeUrl: backendCompleteUrl
    };

    return {
        backend: backendHostConfig
    };
}