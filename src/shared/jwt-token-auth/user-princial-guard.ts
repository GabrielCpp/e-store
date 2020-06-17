import { UserProvider } from "./user-provider";
import { buildErrorTemplate } from "../error-helpers";


export const AuthentificationRequired = buildErrorTemplate('AuthentificationRequired', 'Authentification required')

interface PermissionMissingParameters {
    permissions: string[]
}

export const PermissionMissing = buildErrorTemplate<PermissionMissingParameters>('PermissionMissing', 'Permission missing')


export const USER_PRINCIPAL_GUARD = Symbol.for('UserPrincipalGuard')

export interface IUserPrincipalGuard {
    requireAuthentificated(): Promise<void>
    requirePermissions(...permissions: string[]): Promise<void>
    userId: string;
}

export class UserPrincipalGuard {
    public constructor(private userProvider: UserProvider) {

    }

    public get userId() {
        return this.userProvider.user.id
    }

    public async requireAuthentificated(): Promise<void> {
        if (!await this.userProvider.user.isAuthenticated()) {
            throw AuthentificationRequired.create({})
        }
    }

    public async requirePermissions(...permissions: string[]): Promise<void> {
        await this.requireAuthentificated()

        if (!await this.userProvider.user.hasPermission(...permissions)) {
            throw PermissionMissing.create({ permissions })
        }
    }
}