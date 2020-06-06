import { UserDomain } from "../domains";
import { IRepository } from "@/sanityjs/repository-flavours";

export const USER_REPOSITORY = Symbol.for('IUserRepository')

export interface IUserRepository extends IRepository<UserDomain> {

}