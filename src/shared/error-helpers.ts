
export function newCustomError(name: string, message: string, properties: object = {}): Error {
    const error = Error(message)
    error.name = name;
    Object.assign(error, properties)
    return error
}

export interface IErrorTemplate<Parameters extends object> {
    name: string;
    create: (parameters: Parameters) => Error & Parameters
}

export function buildErrorTemplate<Parameters extends object>(name: string, message: string): IErrorTemplate<Parameters> {
    return {
        name,
        create: (parameters: Parameters) => newCustomError(name, message, parameters) as Error & Parameters
    }
}


export interface IDynamicError {
    name: string;
    create: (message: string, parameters?: object) => Error
}

export function buildDynamicErrorTemplate(name: string): IDynamicError {
    return {
        name,
        create: (message: string, parameters: object = {}) => newCustomError(name, message, parameters)
    }
}