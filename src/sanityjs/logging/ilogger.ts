
export const LOGGER = Symbol.for("Logger")

interface LogMethod {
    (message: string): void;
    (infoObject: object): void;
    (message: string, infoObject: object): void;
}

interface GenericLogMethod {
    (level: string, message: string): void;
    (level: string, message: string, meta: any): void;
}

export interface ILogger {
    log: GenericLogMethod
    error: LogMethod;
    warn: LogMethod;
    info: LogMethod;
    debug: LogMethod;
    verbose: LogMethod;
}