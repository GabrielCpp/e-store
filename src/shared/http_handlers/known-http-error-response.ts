
import { Response } from 'express';
import { IErrorTemplate } from '../error-helpers';
import { ILogger } from '@/shared/logging/ilogger';

export type KnownErrorResponseHandler = (res: Response, e: Error, logger: ILogger) => void
export type KnownErrorResponseBinder = (name: string, handler: KnownErrorResponseHandler) => void;
export type KnownErrorResponseModule = (bind: KnownErrorResponseBinder) => void

export class KnownErrorResponse {
    private responseHandler = new Map<string, KnownErrorResponseHandler>();
    private defaultHandler: KnownErrorResponseHandler = KnownErrorResponse.defaultResponseHandler;

    public static defaultResponseHandler(res: Response, e: Error): void {
        res.status(500).json({ status: '500', message: 'Internal server error' })
    }

    public add(name: string, handler: KnownErrorResponseHandler): KnownErrorResponse {
        this.responseHandler.set(name, handler);
        return this;
    }

    public addTemplate<Parameters extends object>(errorTemplate: IErrorTemplate<Parameters>, handler: (res: Response, e: Error & Parameters, logger: ILogger) => void) {
        this.responseHandler.set(errorTemplate.name, handler as KnownErrorResponseHandler);
        return this;
    }

    public addModules(...bindModules: KnownErrorResponseModule[]) {
        const bind: KnownErrorResponseBinder = (name, handler) => this.add(name, handler)
        bindModules.forEach(m => m(bind))
    }

    public setDefaultHandler(handler: KnownErrorResponseHandler): KnownErrorResponse {
        this.defaultHandler = handler;
        return this;
    }

    public get(error: Error): KnownErrorResponseHandler {
        const handler = this.responseHandler.get(error.name)

        if (handler === undefined) {
            return this.defaultHandler
        }

        return handler
    }
}