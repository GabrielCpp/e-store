import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { QUERY_USER_BY_ID_VALIDATOR, USER_VALIDATOR } from "../validators";
import { USER_DTO, UserDto } from "../dtos";
import { QUERY_USER_BY_ID_DTO, QueryUserByIdDto } from "../dtos/query-user-id-dto";
import { USER_DOMAIN, UserDomain } from "@/core/domains";
import { USER_RESSOURCE_USECASE, UserRessourceUsecase } from "@/core/usecases/user-ressource-usecase";
import { QUERY_USER_BY_ID_DOMAIN, QueryUserByIdDomain } from "@/core/domains/query-user-by-id-domain";
import { CommandResponseHandlerFactory, HandlerType } from "@/sanityjs/http_handlers/command-response-handler-builder";
import { MAPPER, IMapper } from '@/sanityjs/mapper/interfaces/imapper';
import { IModelValidator } from '@/sanityjs/http_handlers/imodelvalidator';
import { IResponseBuilder, RESPONSE_BUILDER } from "@/sanityjs/http_handlers/iresponse-builder";
import { UpdateUserQueryDto, UPDATE_USER_QUERY_DTO } from "../dtos/update-user-query";
import { UPDATE_USER_QUERY_DOMAIN, UpdateUserQueryDomain } from "@/core/domains/user-query-domain";
import { UPDATE_USER_VALIDATOR } from "../validators/update-user-query-validator";

export const USER_RESSOURCE_HANDLER = Symbol.for('GetUserHandler')

export interface FindUserQueryDomain {
    id: string;
}


@injectable()
export class UserRessourceHandler {
    private getByIdHandler: HandlerType<QueryUserByIdDto>
    private createUserHandler: HandlerType<UserDto>
    private removeUserHandler: HandlerType<QueryUserByIdDto>
    private updateUserHandler: HandlerType<UpdateUserQueryDto>

    public constructor(
        @inject(USER_RESSOURCE_USECASE) private usecase: UserRessourceUsecase,
        @inject(RESPONSE_BUILDER) private responseBuilder: IResponseBuilder,
        @inject(MAPPER) private mapper: IMapper,
        @inject(USER_VALIDATOR) private userValidator: IModelValidator,
        @inject(QUERY_USER_BY_ID_VALIDATOR) private findUserValidator: IModelValidator,
        @inject(UPDATE_USER_VALIDATOR) private updateUserQueryValidator: IModelValidator,
    ) {
        this.getByIdHandler = CommandResponseHandlerFactory
            .from<QueryUserByIdDomain>(this.mapper, this.responseBuilder)
            .addValidator(this.findUserValidator)
            .addUseCase(this.usecase.getById.bind(this.usecase))
            .addInputMapping(QUERY_USER_BY_ID_DTO, QUERY_USER_BY_ID_DOMAIN)
            .addResultMapping(USER_DOMAIN, USER_DTO)
            .build<QueryUserByIdDto>();

        this.createUserHandler = CommandResponseHandlerFactory
            .from<UserDomain>(this.mapper, this.responseBuilder)
            .addValidator(this.userValidator)
            .addUseCase(this.usecase.create.bind(this.usecase))
            .addInputMapping(USER_DTO, USER_DOMAIN)
            .addResultMapping(USER_DOMAIN, USER_DTO)
            .build<UserDto>();

        this.removeUserHandler = CommandResponseHandlerFactory
            .from<QueryUserByIdDomain>(this.mapper, this.responseBuilder)
            .addValidator(this.findUserValidator)
            .addUseCase(this.usecase.remove.bind(this.usecase))
            .addInputMapping(QUERY_USER_BY_ID_DTO, QUERY_USER_BY_ID_DOMAIN)
            .build<QueryUserByIdDto>();

        this.updateUserHandler = CommandResponseHandlerFactory
            .from<UpdateUserQueryDomain>(this.mapper, this.responseBuilder)
            .addValidator(this.updateUserQueryValidator)
            .addUseCase(this.usecase.update.bind(this.usecase))
            .addInputMapping(UPDATE_USER_QUERY_DTO, UPDATE_USER_QUERY_DOMAIN)
            .addResultMapping(USER_DOMAIN, USER_DTO)
            .build<UpdateUserQueryDto>();
    }


    public async getById(req: Request, res: Response): Promise<void> {
        const model = { id: req.params.id };
        await this.getByIdHandler(res, model)
    }

    public async create(req: Request, res: Response): Promise<void> {
        const model = req.body;
        await this.createUserHandler(res, model)
    }

    public async update(req: Request, res: Response): Promise<void> {
        const model = { id: req.params.id, payload: req.body };
        this.updateUserHandler(res, model)
    }

    public async remove(req: Request, res: Response): Promise<void> {
        const model = { id: req.params.id };
        this.removeUserHandler(res, model)
    }
} 