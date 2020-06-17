import { ContainerModule, interfaces } from "inversify";
import { KnownErrorResponse } from "@/shared/http_handlers";
import { ValidationError } from '../../shared/http_handlers/errors/validation-error';
import { NoMatchingResult } from "@/shared"
import { AuthentificationRequired, PermissionMissing } from "@/shared/jwt-token-auth/user-princial-guard";

const knownErrorResponse = new KnownErrorResponse()
    .addTemplate(ValidationError, (res, error) => res.status(400).json(error.errors))
    .add(NoMatchingResult.name, (res) => res.sendStatus(404))
    .addTemplate(AuthentificationRequired, res => res.sendStatus(403))
    .addTemplate(PermissionMissing, res => res.sendStatus(401))
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