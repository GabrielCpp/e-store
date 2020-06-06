import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { USER_VALIDATOR, QUERY_USER_BY_ID_VALIDATOR } from "../validators";
import { USER_DTO, UserDto } from "../dtos";
import { QUERY_USER_BY_ID_DTO, QueryUserByIdDto } from "../dtos/query-user-id-dto";
import { USER_DOMAIN, UserDomain } from "@/core/domains";
import { USER_RESSOURCE_USECASE, UserRessourceUsecase } from "@/core/usecases/user-ressource-usecase";
import { QUERY_USER_BY_ID_DOMAIN, QueryUserByIdDomain } from "@/core/domains/query-user-by-id-domain";
import { CommandResponseHandlerFactory, HandlerType } from "@/sanityjs/http_handlers/command-response-handler-builder";
import { MAPPER, IMapper } from '@/sanityjs/mapper/interfaces/imapper';
import { IModelValidator } from '@/sanityjs/http_handlers/imodelvalidator';
import { IResponseBuilder, RESPONSE_BUILDER } from "@/sanityjs/http_handlers/iresponse-builder";

export const USER_RESSOURCE_HANDLER = Symbol.for('GetUserHandler')

export interface FindUserQueryDomain {
    id: string;
}


@injectable()
export class UserRessourceHandler {
    private getByIdHandler: HandlerType<QueryUserByIdDto>
    private createUserHandler: HandlerType<UserDto>

    public constructor(
        @inject(USER_RESSOURCE_USECASE) private usecase: UserRessourceUsecase,
        @inject(RESPONSE_BUILDER) private responseBuilder: IResponseBuilder,
        @inject(MAPPER) private mapper: IMapper,
        @inject(USER_VALIDATOR) private user_validator: IModelValidator,
        @inject(QUERY_USER_BY_ID_VALIDATOR) private find_user_validator: IModelValidator
    ) {
        this.getByIdHandler = CommandResponseHandlerFactory
            .from<QueryUserByIdDomain>(this.mapper, this.responseBuilder)
            .addValidator(this.find_user_validator)
            .addUseCase(this.usecase.getById.bind(this.usecase))
            .addInputMapping(QUERY_USER_BY_ID_DTO, QUERY_USER_BY_ID_DOMAIN)
            .addResultMapping(USER_DOMAIN, USER_DTO)
            .build<QueryUserByIdDto>();

        this.createUserHandler = CommandResponseHandlerFactory
            .from<UserDomain>(this.mapper, this.responseBuilder)
            .addValidator(this.user_validator)
            .addUseCase(this.usecase.create.bind(this.usecase))
            .addInputMapping(USER_DTO, USER_DOMAIN)
            .addResultMapping(USER_DOMAIN, USER_DTO)
            .build<UserDto>();
    }


    public async getById(req: Request, res: Response): Promise<void> {
        const model = { id: req.params.id };
        await this.getByIdHandler(res, model)
    }

    public async create(req: Request, res: Response): Promise<void> {
        const model = req.body;
        await this.createUserHandler(res, model)
    }
} 