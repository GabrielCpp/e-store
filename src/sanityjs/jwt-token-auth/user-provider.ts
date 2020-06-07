export interface UserPrincipal {
    id: string | null;
    isAuthenticated(): Promise<boolean>;
    hasPermission(...permissions: string[]): Promise<boolean>;
}

export const USER_PROVIDER = Symbol.for('UserProvider')

export interface IUserProvider {
    user: UserPrincipal
}

export class UserProvider implements IUserProvider {
    user: UserPrincipal;
}