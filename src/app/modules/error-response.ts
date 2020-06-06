import { ContainerModule, decorate, injectable, interfaces } from "inversify";
import { KnownErrorResponse } from "@/sanityjs/http_handlers";
import { ValidationError } from '../../sanityjs/http_handlers/errors/validation-error';

const knownErrorResponse = new KnownErrorResponse()
    .addTemplate(ValidationError, (res, error) => res.status(400).json(error.errors))

export const responseBuilderModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    decorate(injectable(), KnownErrorResponse)
    bind<KnownErrorResponse>(KnownErrorResponse).toConstantValue(knownErrorResponse)
});