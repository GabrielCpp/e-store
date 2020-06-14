import { controller, httpGet, httpPost, BaseHttpController, request, response, httpPatch, httpDelete } from "inversify-express-utils";
import { ApiPath, SwaggerDefinitionConstant, ApiOperationGet, ApiOperationPost, ApiOperationPatch, ApiOperationDelete } from 'swagger-express-ts';
import { Request, Response } from "express";
import { inject } from "inversify";
import { UserRessourceHandler, USER_RESSOURCE_HANDLER } from "../handlers";
import { JwtDecoderMiddleware } from "../middlewares";

@ApiPath({
    name: 'User',
    path: '/user',
})
@controller("/user", JwtDecoderMiddleware)
export class UserController extends BaseHttpController {
    @inject(USER_RESSOURCE_HANDLER) private userHandler: UserRessourceHandler

    @ApiOperationGet({
        path: "/{id}",
        description: 'Get car object',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {
                model: 'User',
            },
            400: {},
            404: {},
            403: {}
        },
    })
    @httpGet("/:id")
    public async getById(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.getById(req, res)
    }

    @ApiOperationPost({
        description: 'Create user',
        parameters: {
            body: {
                model: 'User'
            },
        },
        responses: {
            200: {
                model: 'User',
            },
            400: {},
            404: {},
            403: {}
        },
    })
    @httpPost("/")
    public async create(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.create(req, res)
    }

    @ApiOperationPatch({
        path: "/{id}",
        description: 'Update user',
        parameters: {
            body: {
                model: 'PartialUser'
            },
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {
                model: 'User',
            },
            400: {},
            404: {},
            403: {}
        },
    })
    @httpPatch("/:id")
    public async update(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.update(req, res)
    }

    @ApiOperationDelete({
        path: "/{id}",
        description: 'Delete user',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: {},
            404: {},
            403: {}
        },
    })
    @httpDelete("/:id")
    public async remove(@request() req: Request, @response() res: Response): Promise<void> {
        await this.userHandler.remove(req, res)
    }
}