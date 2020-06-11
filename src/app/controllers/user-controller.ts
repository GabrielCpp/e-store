import { controller, httpGet, httpPost, BaseHttpController, request, response, httpPatch, httpDelete } from "inversify-express-utils";
import { Request, Response } from "express";
import { inject } from "inversify";
import { UserRessourceHandler, USER_RESSOURCE_HANDLER } from "../handlers";
import { JwtDecoderMiddleware } from "../middlewares";

@controller("/user", JwtDecoderMiddleware)
export class UserController extends BaseHttpController {
    @inject(USER_RESSOURCE_HANDLER) private userHandler: UserRessourceHandler

    @httpGet("/:id")
    public async getById(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.getById(req, res)
    }

    @httpPost("/")
    public async create(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.create(req, res)
    }

    @httpPatch("/")
    public async update(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.update(req, res)
    }

    @httpDelete("/")
    public async remove(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.remove(req, res)
    }
}