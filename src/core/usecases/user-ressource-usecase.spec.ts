import { Container } from 'inversify'
import { USER_RESSOURCE_USECASE, UserRessourceUsecase } from './user-ressource-usecase'
import { IUserRepository, USER_REPOSITORY } from '../repositories/iuser-repository';
import { USER_PRINCIPAL_GUARD, IUserPrincipalGuard } from '../../sanityjs/jwt-token-auth/user-princial-guard';
import { UserDomain } from '../domains';
import { ClassMock } from '@/test-helpers'

describe('UserRessourceUsecase', () => {
    let container: Container;
    let usecase: UserRessourceUsecase;
    let userPrincipalGuard: ClassMock<IUserPrincipalGuard>
    let userRepository: ClassMock<IUserRepository>

    beforeEach(() => {
        userPrincipalGuard = new ClassMock<IUserPrincipalGuard>()
        userRepository = new ClassMock<IUserRepository>()
        container = new Container();
        container.bind<IUserPrincipalGuard>(USER_PRINCIPAL_GUARD).toConstantValue(userPrincipalGuard.object)
        container.bind<IUserRepository>(USER_REPOSITORY).toConstantValue(userRepository.object)
        container.bind<UserRessourceUsecase>(USER_RESSOURCE_USECASE).to(UserRessourceUsecase)
        usecase = container.get(USER_RESSOURCE_USECASE)
    })

    test('', async () => {
        const userDomain: UserDomain = {
            id: '123',
            email: 'gabc',
            name: 'test'
        }

        userPrincipalGuard.setup(x => x.requirePermissions('user.create'))
        userRepository.setup(x => x.add(userDomain))

        const actualCreatedUser = await usecase.create(userDomain)
        expect(actualCreatedUser).toEqual(userDomain)
    })
})