
import { IResponseBuilder } from './iresponse-builder';
import { Response } from 'express';
import { IErrorTemplate } from '../error-helpers';

export type KnownErrorResponseeHandler = (res: Response, e: Error) => void
export type KnownErrorResponseBinder = (name: string, handler: KnownErrorResponseeHandler) => void;
export type KnownErrorResponseModule = (bind: KnownErrorResponseBinder) => void

export class KnownErrorResponse {
    private responseHandler = new Map<string, KnownErrorResponseeHandler>();
    private defaultHandler: KnownErrorResponseeHandler = KnownErrorResponse.defaultResponseHandler;

    public static defaultResponseHandler(res: Response, e: Error): void {
        res.status(500).json({ status: '500', message: 'Internal server error' })
    }

    public add(name: string, handler: KnownErrorResponseeHandler): KnownErrorResponse {
        this.responseHandler.set(name, handler);
        return this;
    }

    public addTemplate<Parameters extends object>(errorTemplate: IErrorTemplate<Parameters>, handler: (res: Response, e: Error & Parameters) => void) {
        this.responseHandler.set(errorTemplate.name, handler as KnownErrorResponseeHandler);
        return this;
    }

    public addModules(...bindModules: KnownErrorResponseModule[]) {
        const bind: KnownErrorResponseBinder = (name, handler) => this.add(name, handler)
        bindModules.forEach(m => m(bind))
    }

    public setDefaultHandler(handler: KnownErrorResponseeHandler): KnownErrorResponse {
        this.defaultHandler = handler;
        return this;
    }

    public handle(res: Response, error: Error) {
        const handler = this.responseHandler.get(error.name)

        if (handler === undefined) {
            this.defaultHandler(res, error)
        }
        else {
            handler(res, error)
        }
    }

}

export class ResponseBuilder implements IResponseBuilder {
    public constructor(private knownErrorResponse: KnownErrorResponse) {

    }

    public buildFromError(res: Response, error: Error): void {
        this.knownErrorResponse.handle(res, error)
    }

    public serializeJson(res: Response, obj: unknown): void {
        res.json(obj)
    }
}