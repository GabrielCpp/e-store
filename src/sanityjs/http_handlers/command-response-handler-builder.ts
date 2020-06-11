
import { Response } from "express";
import { IModelValidator } from "./imodelvalidator";
import { IMapper, TypeIdentifier } from "../mapper";
import { IResponseBuilder } from "./iresponse-builder";
import { Dictionary } from "../type-utils";

export type HandlerType<Dto> = (res: Response, model: Dto) => Promise<void>

interface IdentifierMapping {
    from: TypeIdentifier;
    to: TypeIdentifier
}

export class CommandResponseHandlerFactory<Domain> {
    private validator: IModelValidator;
    private invokeUsecase: (domain: Domain) => unknown
    private inputMapping: IdentifierMapping
    private resultMapping: IdentifierMapping | undefined = undefined

    public static from<TDomain>(
        mapper: IMapper,
        responseBuilder: IResponseBuilder,
    ): CommandResponseHandlerFactory<TDomain> {
        return new CommandResponseHandlerFactory<TDomain>(mapper, responseBuilder)
    }

    public constructor(
        private mapper: IMapper,
        private responseBuilder: IResponseBuilder,
    ) {

    }

    public addValidator(validator: IModelValidator): CommandResponseHandlerFactory<Domain> {
        this.validator = validator
        return this
    }

    public addUseCase(invokeUsecase: (domain: Domain) => unknown): CommandResponseHandlerFactory<Domain> {
        this.invokeUsecase = invokeUsecase
        return this
    }

    public addInputMapping(from: TypeIdentifier, to: TypeIdentifier): CommandResponseHandlerFactory<Domain> {
        this.inputMapping = { from, to }
        return this
    }

    public addResultMapping(from: TypeIdentifier, to: TypeIdentifier): CommandResponseHandlerFactory<Domain> {
        this.resultMapping = { from, to }
        return this
    }

    public build<Dto extends object>(): HandlerType<Dto> {
        if (this.resultMapping === undefined) {
            return this.commandHandler<Dto>()
        }

        return this.commandAndResponseHandler<Dto>()
    }

    private commandAndResponseHandler<Dto extends object>(): HandlerType<Dto> {
        const inputMapping = this.inputMapping as IdentifierMapping;
        const resultMapping = this.resultMapping as IdentifierMapping

        return async (res: Response, model: Dto): Promise<void> => {
            try {
                this.validator.validate(model as Dictionary<unknown>)
                const domain = this.mapper.map<Dto, Domain>(model, inputMapping.from, inputMapping.to)
                const resultDomain = await this.invokeUsecase(domain)
                const resultModel = this.mapper.map(resultDomain, resultMapping.from, resultMapping.to)
                this.responseBuilder.serializeJson(res, resultModel)
            }
            catch (e) {
                this.responseBuilder.buildFromError(res, e)
            }
        }
    }

    private commandHandler<Dto extends object>(): HandlerType<Dto> {
        const inputMapping = this.inputMapping as IdentifierMapping;

        return async (res: Response, model: Dto): Promise<void> => {
            try {
                this.validator.validate(model as Dictionary<unknown>)
                const domain = this.mapper.map<Dto, Domain>(model, inputMapping.from, inputMapping.to)
                await this.invokeUsecase(domain)
                this.responseBuilder.sendSuccess(res)
            }
            catch (e) {
                this.responseBuilder.buildFromError(res, e)
            }
        }
    }
}


