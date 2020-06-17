import { ContainerModule, decorate, injectable, interfaces, inject } from "inversify";
import { TableRepository } from "@/shared/repository-flavours";
import { Repository } from "typeorm";
import { IResponseBuilder, RESPONSE_BUILDER } from '@/shared/http_handlers/iresponse-builder';
import { ResponseBuilder } from '../../shared/http_handlers/response-builder';
import { BaseValidator, KnownErrorResponse } from "@/shared/http_handlers";
import { LOGGER } from "@/shared/logging/ilogger";
import { bindInjectable } from "@/shared/inversify-injectable";

export const commonModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    decorate(injectable(), TableRepository)
    decorate(injectable(), Repository)
    decorate(injectable(), BaseValidator)
    bind<IResponseBuilder>(RESPONSE_BUILDER).to(bindInjectable(ResponseBuilder, [LOGGER, KnownErrorResponse]))
});