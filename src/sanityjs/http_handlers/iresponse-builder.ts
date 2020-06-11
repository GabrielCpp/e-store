import { Response } from "express";

export const RESPONSE_BUILDER = Symbol.for("IResponseBuilder")

export interface IResponseBuilder {
    buildFromError(res: Response, error: Error): void;
    serializeJson(res: Response, body: unknown): void;
    sendSuccess(res: Response): void
}
