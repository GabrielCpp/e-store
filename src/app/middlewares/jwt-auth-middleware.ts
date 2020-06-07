import jwt, { VerifyErrors } from 'jsonwebtoken'
import express from 'express'
import { BaseMiddleware } from "inversify-express-utils";
import { inject, injectable } from 'inversify';
import { Dictionary } from '../../sanityjs/type-utils';
import { USER_PROVIDER, JWT_CERTIFICATE, IUserProvider } from '@/sanityjs/jwt-token-auth';


@injectable()
export class JwtDecoderMiddleware extends BaseMiddleware {
    @inject(USER_PROVIDER) private userProvider: IUserProvider;
    @inject(JWT_CERTIFICATE) private cert: string;

    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.headers.authorization !== undefined) {
            const token = req.headers.authorization;
            jwt.verify(token, this.cert, (err: VerifyErrors | null, decoded: object | undefined) => {
                if (err) {
                    this.userProvider.user = {
                        id: null,
                        isAuthenticated() {
                            return Promise.resolve(false)
                        },
                        hasPermission(...permissions: string[]) {
                            return Promise.resolve(false)
                        },
                    }
                }
                else if (decoded !== undefined) {
                    this.userProvider.user = {
                        id: (decoded as Dictionary<string>).id,
                        isAuthenticated() {
                            return Promise.resolve(true)
                        },
                        hasPermission(...permissions: string[]) {
                            return Promise.resolve(false)
                        },
                    }
                }

                next();
            });
        }
        else {
            next();
        }
    }
}
