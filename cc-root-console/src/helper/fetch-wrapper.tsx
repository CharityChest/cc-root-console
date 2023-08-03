import { userService } from '@/service/user.service';

import { getHostConfig, HostConfig} from '@/config/host';

const hostConfig : HostConfig = getHostConfig();

export const BackendFetchWrapper = {
    get: requestHost(hostConfig.backend.completeUrl, 'GET'),
    post: requestHost(hostConfig.backend.completeUrl, 'POST'),
    put: requestHost(hostConfig.backend.completeUrl, 'PUT'),
    delete: requestHost(hostConfig.backend.completeUrl, 'DELETE')
};

export const fetchWrapper = {
    backend: BackendFetchWrapper
}

function requestHost(host: string, method: string) : (uri: string, body?: any) => Promise<any> {
    return (uri: string, body?: any) => {
        return request(method,`${host}/${uri}/`, body);
    }
}

const request = async (method: string, url: string, body: any) : Promise<any> => {
    const headers : Headers = authHeader(url)
    const requestOptions : RequestInit = {
        method,
        headers: headers
    };
    if (body) {
        headers.append('Content-Type', 'application/json');
        requestOptions.body = JSON.stringify(body);
    }
    const response : Response = await fetch(url, requestOptions);
    return handleResponse(response);
}

function authHeader(url: string) : Headers {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userService.userValue;
    const isLoggedIn = user?.token;
    const isApiUrl = url.startsWith(hostConfig.backend.completeUrl);
    const headers : Headers = new Headers();
    if (isLoggedIn && isApiUrl) {
        headers.append('Authorization', `Bearer ${user.token}`);
    }

    return headers;
}

async function handleResponse(response : Response) : Promise<any> {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    // check for error response
    if (!response.ok) {
        if ([401, 403].includes(response.status) && userService.userValue) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            userService.logout();
        }

        // get error message from body or default to response status
        const error = data?.message || response.statusText;
        return Promise.reject(error);
    }

    return data;
}