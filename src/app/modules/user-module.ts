import { ContainerModule, interfaces, decorate, injectable, AsyncContainerModule } from "inversify";
import { UserRessourceHandler, USER_RESSOURCE_HANDLER } from '../handlers/user-ressource-handler';
import { UserRessourceUsecase } from '@/core/usecases/user-ressource-usecase';
import { USER_RESSOURCE_USECASE } from '../../core/usecases/user-ressource-usecase';
import { IUserRepository } from "@/core/repositories/iuser-repository";
import { USER_REPOSITORY } from '../../core/repositories/iuser-repository';
import { UserRepository } from '../../infrastructure/repositories/user-repository';
import { USER_VALIDATOR, UserValidator } from '../validators/user-validator';
import { QUERY_USER_BY_ID_VALIDATOR, QueryUserByIdValidator } from "../validators";
import { IModelValidator } from '@/shared/http_handlers/imodelvalidator';
import { UPDATE_USER_VALIDATOR, UpdateUserQueryValidator } from '../validators/update-user-query-validator';

export const userModule = new AsyncContainerModule(async (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    decorate(injectable(), UserRepository)

    bind<UserRessourceHandler>(USER_RESSOURCE_HANDLER).to(UserRessourceHandler);
    bind<UserRessourceUsecase>(USER_RESSOURCE_USECASE).to(UserRessourceUsecase);
    bind<IUserRepository>(USER_REPOSITORY).to(UserRepository)
    bind<IModelValidator>(USER_VALIDATOR).toConstantValue(await UserValidator.create(UserValidator))
    bind<IModelValidator>(QUERY_USER_BY_ID_VALIDATOR).toConstantValue(await QueryUserByIdValidator.create(QueryUserByIdValidator));
    bind<IModelValidator>(UPDATE_USER_VALIDATOR).toConstantValue(await UpdateUserQueryValidator.create(UpdateUserQueryValidator));
});