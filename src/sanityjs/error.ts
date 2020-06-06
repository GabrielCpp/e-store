
import { Dictionary } from './type-utils';

export function newCustomError(name: string, message: string, properties: Dictionary<unknown> = {}): Error {
    const error = Error(message)
    error.name = name;
    Object.assign(error, properties)
    return error
}