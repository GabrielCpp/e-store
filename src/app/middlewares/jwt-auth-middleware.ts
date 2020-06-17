import express from 'express'
import { BaseMiddleware } from "inversify-express-utils";
import { inject, injectable, Container } from 'inversify';
import { Dictionary } from '../../shared/type-utils';
import { USER_PROVIDER, IUserProvider, JWT_DECODER, IJwtDecoder, UserPrincipal } from '@/shared/jwt-token-auth';
import { IResponseBuilder, RESPONSE_BUILDER } from '@/shared'
import { CONTAINER } from '../types';

interface TokenPayload {
    id: string;
    permissions: string[]
}

class AuthenticatedUserPrincipal implements UserPrincipal {
    public id: string;

    public constructor(private tokenPayload: TokenPayload) {
        this.id = tokenPayload.id;
    }

    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true)
    }

    public hasPermission(...permissions: string[]): Promise<boolean> {
        let granted = true;

        for (const permission of permissions) {
            if (!this.tokenPayload.permissions.includes(permission)) {
                granted = false;
                break;
            }
        }

        return Promise.resolve(granted)
    }
}

const unauthorizedUser: UserPrincipal = {
    id: null,
    isAuthenticated() {
        return Promise.resolve(false)
    },
    hasPermission(...permissions: string[]) {
        return Promise.resolve(false)
    },
}

@injectable()
export class JwtDecoderMiddleware extends BaseMiddleware {
    @inject(JWT_DECODER) private jwtDecoder: IJwtDecoder;
    @inject(RESPONSE_BUILDER) private responseBuilder: IResponseBuilder;

    public async handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> {
        const httpContext = this.httpContext;
        let user: UserPrincipal = unauthorizedUser;

        if (req.headers.authorization === undefined) {
            httpContext.container.bind<IUserProvider>(USER_PROVIDER).toConstantValue({ user })
            next();
            return
        }

        let token = req.headers.authorization;

        if (token.startsWith('Bearer')) {
            token = token.substring(7)
        }
        else {
            this.responseBuilder.buildFromError(res, new Error())
            return;
        }

        try {
            const decoded = await this.jwtDecoder.verify(token) as TokenPayload;
            user = new AuthenticatedUserPrincipal(decoded);
            httpContext.container.bind<IUserProvider>(USER_PROVIDER).toConstantValue({ user })
            next();
        }
        catch (e) {
            this.responseBuilder.buildFromError(res, e)
        }
    }
}

