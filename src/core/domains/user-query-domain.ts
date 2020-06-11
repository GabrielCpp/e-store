import { QueryUserByIdDomain } from "./query-user-by-id-domain";
import { UserDomain } from "./user-domain";

export const UPDATE_USER_QUERY_DOMAIN = Symbol.for('UpdateUserQueryDomain')

export interface UpdateUserQueryDomain extends QueryUserByIdDomain {
    payload: Partial<UserDomain>
}