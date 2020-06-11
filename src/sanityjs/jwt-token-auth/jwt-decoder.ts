import jwt, { VerifyErrors } from 'jsonwebtoken'

export const JWT_PUBLIC_KEY = Symbol.for('JwtPublicKey')
export const JWT_DECODER = Symbol.for('JwtDecoder')

export interface IJwtDecoder {
    verify(token: string): Promise<object>
}

export class JwtDecoder implements IJwtDecoder {
    public constructor(private publicKey: string) {

    }

    public async verify(token: string): Promise<object> {
        return await new Promise((resolve, reject) => {
            jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }, (err: VerifyErrors | null, decoded: object | undefined) => {
                if (decoded !== undefined) {
                    resolve(decoded)
                }
                else {
                    reject(err)
                }
            });
        })
    }
}