import { inject, injectable } from 'inversify';
import { IUserRepository, USER_REPOSITORY } from '../repositories/iuser-repository';
import { QueryUserByIdDomain } from '../domains/query-user-by-id-domain';
import { UserDomain } from '../domains';

export const USER_RESSOURCE_USECASE = Symbol.for('UserRessourceUsecase')

@injectable()
export class UserRessourceUsecase {
    @inject(USER_REPOSITORY) private userRepository: IUserRepository

    public async getById(userId: QueryUserByIdDomain): Promise<UserDomain> {
        return await this.userRepository.findOneBy(userId);
    }

    public async create(user: UserDomain): Promise<UserDomain> {
        await this.userRepository.add(user)
        return user;
    }
}