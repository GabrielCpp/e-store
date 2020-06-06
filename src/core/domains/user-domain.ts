
export const USER_DOMAIN = Symbol.for('UserDomain')

export interface UserDomain {
    id: string;
    name: string;
    email: string;
}