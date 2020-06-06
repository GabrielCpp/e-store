
import { IResponseBuilder } from './iresponse-builder';
import { Response } from 'express';
import { ILogger } from '@/sanityjs/logging/ilogger';
import { KnownErrorResponse } from './known-http-error-response';

export class ResponseBuilder implements IResponseBuilder {
    public constructor(private logger: ILogger, private knownErrorResponse: KnownErrorResponse) {

    }

    public buildFromError(res: Response, error: Error): void {
        const handler = this.knownErrorResponse.get(error)
        handler(res, error, this.logger)
    }

    public serializeJson(res: Response, obj: unknown): void {
        res.json(obj)
    }
}