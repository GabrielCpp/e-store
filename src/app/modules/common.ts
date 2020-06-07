import { ContainerModule, decorate, injectable, interfaces, inject } from "inversify";
import { TableRepository } from "@/sanityjs/repository-flavours";
import { Repository } from "typeorm";
import { IResponseBuilder, RESPONSE_BUILDER } from '@/sanityjs/http_handlers/iresponse-builder';
import { ResponseBuilder } from '../../sanityjs/http_handlers/response-builder';
import { BaseValidator, KnownErrorResponse } from "@/sanityjs/http_handlers";
import { LOGGER } from "@/sanityjs/logging/ilogger";
import { bindInjectable } from "@/sanityjs/inversify-injectable";

export const commonModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    decorate(injectable(), TableRepository)
    decorate(injectable(), Repository)
    decorate(injectable(), BaseValidator)
    bind<IResponseBuilder>(RESPONSE_BUILDER).to(bindInjectable(ResponseBuilder, [LOGGER, KnownErrorResponse]))
});