import { controller, httpGet, httpPost, BaseHttpController, request, response } from "inversify-express-utils";
import { Request, Response } from "express";
import { inject } from "inversify";
import { UserRessourceHandler, USER_RESSOURCE_HANDLER } from "../handlers";

@controller("/user")
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

}