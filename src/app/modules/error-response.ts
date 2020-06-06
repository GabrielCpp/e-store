import { ContainerModule, interfaces } from "inversify";
import { KnownErrorResponse } from "@/sanityjs/http_handlers";
import { ValidationError } from '../../sanityjs/http_handlers/errors/validation-error';

const knownErrorResponse = new KnownErrorResponse()
    .addTemplate(ValidationError, (res, error) => res.status(400).json(error.errors))
    .setDefaultHandler((res, error, logger) => {
        res.status(500).json({ status: '500', message: 'Internal server error' })
        logger.error({
            name: error.name,
            message: error.message,
            stack: error.stack
        })
    })

export const responseBuilderModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<KnownErrorResponse>(KnownErrorResponse).toConstantValue(knownErrorResponse)
});