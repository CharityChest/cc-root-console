export const stripCharacters = (str: string|undefined, characters: string = " "): string => {
    const pattern = new RegExp(`^[${characters}]+|[${characters}]+$`, 'g');
    return String(str).replace(pattern, '');
}

export const stripCharactersLeft = (str: string|undefined, characters: string = " "): string => {
    const pattern = new RegExp(`^[${characters}]+`, 'g');
    return String(str).replace(pattern, '');
}

export const stripCharactersRight = (str: string|undefined, characters: string = " "): string => {
    const pattern = new RegExp(`[${characters}]+$`, 'g');
    return String(str).replace(pattern, '');
}

export const randomUnsafe = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }
    return result;
}
