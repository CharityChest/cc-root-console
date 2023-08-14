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
        backend: buildBackendCompleteConfig()
    };
}