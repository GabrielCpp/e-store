import { inject, injectable } from 'inversify';
import { IUserRepository, USER_REPOSITORY } from '../repositories/iuser-repository';
import { QueryUserByIdDomain } from '../domains/query-user-by-id-domain';
import { UserDomain } from '../domains';
import { USER_PRINCIPAL_GUARD, IUserPrincipalGuard } from '../../sanityjs/jwt-token-auth/user-princial-guard';

export const USER_RESSOURCE_USECASE = Symbol.for('UserRessourceUsecase')

@injectable()
export class UserRessourceUsecase {
    @inject(USER_REPOSITORY) private userRepository: IUserRepository
    @inject(USER_PRINCIPAL_GUARD) private userPrincipalGuard: IUserPrincipalGuard;

    public async getById(queryUserById: QueryUserByIdDomain): Promise<UserDomain> {
        if (this.userPrincipalGuard.userId !== queryUserById.id) {
            await this.userPrincipalGuard.requirePermissions('user.search')
        }

        return await this.userRepository.findOneBy(queryUserById);
    }

    public async create(user: UserDomain): Promise<UserDomain> {
        await this.userPrincipalGuard.requirePermissions('user.create')
        await this.userRepository.add(user)
        return user;
    }

    public async update(userId: QueryUserByIdDomain & { payload: Partial<UserDomain> }): Promise<UserDomain> {
        await this.userPrincipalGuard.requirePermissions('user.update')
        await this.userRepository.updateBy(userId, userId.payload)
        return await this.userRepository.findOneBy(userId);
    }

    public async remove(userId: QueryUserByIdDomain): Promise<void> {
        await this.userPrincipalGuard.requirePermissions('user.delete')
        await this.userRepository.removeBy(userId)
    }
}