import jwt, { VerifyErrors } from 'jsonwebtoken'

export const JWT_ENCODER = Symbol.for('JwtEncoder')
export const JWT_CERTIFICATE_KEY = Symbol.for('JwtCertificateKey')

export interface IJwtEncoder {
    sign(token: object): Promise<string>
}

export class JwtEncoder implements IJwtEncoder {
    public constructor(private secret: string) {

    }

    public async sign(payload: object): Promise<string> {
        return await new Promise((resolve, reject) => {
            jwt.sign(payload, this.secret, { expiresIn: '1h' }, (error, jwtToken) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(jwtToken)
                }
            });
        })
    }
}