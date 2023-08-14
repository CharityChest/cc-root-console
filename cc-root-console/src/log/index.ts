export const log = (level : string, ...args: any[]) => console.log(level, ...args)

export const logError = (...args: any[]) => log('error', ...args)

export const logInfo = (...args: any[]) => log('info', ...args)

export const logDebug = (...args: any[]) => log('debug', ...args)