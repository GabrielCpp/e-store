import { ContainerModule, interfaces } from "inversify";
import { JwtDecoderMiddleware } from "../middlewares";
import { JWT_CERTIFICATE, JWT_CERTIFICATE_KEY, JwtEncoder, IJwtEncoder, JWT_ENCODER, USER_PROVIDER, UserProvider, IUserProvider } from "@/sanityjs/jwt-token-auth";
import { bindInjectable } from "@/sanityjs/inversify-injectable";


export const middlewareModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    const certificateKey = Buffer.from(process.env.CERTIFICATE_KEY as string, 'base64').toString('ascii')
    const certificate = Buffer.from(process.env.CERTIFICATE as string, 'base64').toString('ascii')
    bind<JwtDecoderMiddleware>(JwtDecoderMiddleware).to(JwtDecoderMiddleware)
    bind<string>(JWT_CERTIFICATE).toConstantValue(certificate)
    bind<string>(JWT_CERTIFICATE_KEY).toConstantValue(certificateKey)
    bind<IJwtEncoder>(JWT_ENCODER).to(bindInjectable(JwtEncoder, [JWT_CERTIFICATE_KEY]))
    bind<IUserProvider>(USER_PROVIDER).to(bindInjectable(UserProvider, [])).inRequestScope()
});