import { ContainerModule, interfaces } from "inversify";
import { JWT_PUBLIC_KEY, JWT_PRIVATE_KEY, JwtEncoder, IJwtEncoder, JWT_ENCODER, USER_PROVIDER, UserProvider, IUserProvider, JWT_PRIVATE_KEY_PASSPHRASE, JWT_ENCODER_SIGN_OPTIONS } from "@/shared/jwt-token-auth";
import { bindInjectable } from "@/shared/inversify-injectable";
import { UserPrincipalGuard, USER_PRINCIPAL_GUARD, IUserPrincipalGuard } from "@/shared/jwt-token-auth/user-princial-guard";
import { SignOptions } from 'jsonwebtoken';
import { IJwtDecoder, JWT_DECODER, JwtDecoder } from '../../shared/jwt-token-auth/jwt-decoder';
import { JwtDecoderMiddleware } from "../middlewares";


export const middlewareModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    const certificateKey = Buffer.from(process.env.JWT_PRIVATE_KEY as string, 'base64').toString('ascii')
    const certificate = Buffer.from(process.env.JWT_PUBLIC_KEY as string, 'base64').toString('ascii')
    const passphrase = process.env.JWT_PRIVATE_KEY_PASSPHRASE as string
    const signOptions = JSON.parse(process.env.JWT_ENCODER_SIGN_OPTIONS as string)

    bind<JwtDecoderMiddleware>(JwtDecoderMiddleware).to(JwtDecoderMiddleware).inRequestScope()
    bind<string>(JWT_PRIVATE_KEY_PASSPHRASE).toConstantValue(passphrase)
    bind<string>(JWT_PUBLIC_KEY).toConstantValue(certificate)
    bind<string>(JWT_PRIVATE_KEY).toConstantValue(certificateKey)
    bind<SignOptions>(JWT_ENCODER_SIGN_OPTIONS).toConstantValue(signOptions)
    bind<IJwtEncoder>(JWT_ENCODER).to(bindInjectable(JwtEncoder, [JWT_PRIVATE_KEY, JWT_PRIVATE_KEY_PASSPHRASE, JWT_ENCODER_SIGN_OPTIONS]))
    bind<IUserProvider>(USER_PROVIDER).to(bindInjectable(UserProvider, [])).inRequestScope()
    bind<IUserPrincipalGuard>(USER_PRINCIPAL_GUARD).to(bindInjectable(UserPrincipalGuard, [USER_PROVIDER]))
    bind<IJwtDecoder>(JWT_DECODER).to(bindInjectable(JwtDecoder, [JWT_PUBLIC_KEY]))
});