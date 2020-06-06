import { ContainerModule, decorate, injectable, interfaces, inject } from "inversify";
import { TableRepository } from "@/sanityjs/repository-flavours";
import { Repository } from "typeorm";
import { IResponseBuilder, RESPONSE_BUILDER } from '@/sanityjs/http_handlers/iresponse-builder';
import { ResponseBuilder, KnownErrorResponse } from '../../sanityjs/http_handlers/response-builder';
import { BaseValidator } from "@/sanityjs/http_handlers";

function bindConstructor(Class: any, parameters: any[]) {
    const x = injectable()(Class)
    parameters.forEach((p, i) => inject(p)(Class, undefined as any, i))
    return x
}


export const commonModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    decorate(injectable(), TableRepository)
    decorate(injectable(), Repository)
    decorate(injectable(), BaseValidator)
    bind<IResponseBuilder>(RESPONSE_BUILDER).to(bindConstructor(ResponseBuilder, [KnownErrorResponse]))
});