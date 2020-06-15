import { Container } from 'inversify'
import { USER_RESSOURCE_USECASE, UserRessourceUsecase } from './user-ressource-usecase'
import { IUserRepository, USER_REPOSITORY } from '../repositories/iuser-repository';
import { USER_PRINCIPAL_GUARD, IUserPrincipalGuard } from '../../sanityjs/jwt-token-auth/user-princial-guard';
import { UserDomain } from '../domains';
import { Mock } from 'moq.ts'

describe('UserRessourceUsecase', () => {
    let container: Container;
    let usecase: UserRessourceUsecase;
    let userPrincipalGuard: Mock<IUserPrincipalGuard>
    let userRepository: Mock<IUserRepository>

    beforeEach(() => {
        userPrincipalGuard = new Mock<IUserPrincipalGuard>()
        userRepository = new Mock<IUserRepository>()
        container = new Container();
        container.bind<IUserPrincipalGuard>(USER_PRINCIPAL_GUARD).toConstantValue(userPrincipalGuard.object())
        container.bind<IUserRepository>(USER_REPOSITORY).toConstantValue(userRepository.object())
        container.bind<UserRessourceUsecase>(USER_RESSOURCE_USECASE).to(UserRessourceUsecase)
        usecase = container.get(USER_RESSOURCE_USECASE)
    })

    test('', async () => {
        const userDomain: UserDomain = {
            id: '123',
            email: 'gabc',
            name: 'test'
        }

        userPrincipalGuard.setup(x => x.requirePermissions('user.create')).returns(Promise.resolve(undefined))
        userRepository.setup(x => x.add(userDomain)).returns(Promise.resolve(undefined))

        const actualCreatedUser = await usecase.create(userDomain)
        expect(actualCreatedUser).toEqual(userDomain)
    })
})