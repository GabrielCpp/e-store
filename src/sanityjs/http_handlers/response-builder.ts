
import { IResponseBuilder } from './iresponse-builder';
import { Response } from 'express';

export class ResponseBuilder implements IResponseBuilder {
    public buildFromError(res: Response, error: Error): void {
        res.status(500).json({ name: error.name, message: error.message })
    }

    public serializeJson(res: Response, obj: unknown): void {
        res.json(obj)
    }
}