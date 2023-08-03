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