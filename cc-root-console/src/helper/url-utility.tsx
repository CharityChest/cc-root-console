export const getQueryParams = (param: string, _default? : string, url?: string) : string => {
    const ur = url || window.location.href;
    const u = new URL(ur);
    return u.searchParams.get(param) || _default || '';
}