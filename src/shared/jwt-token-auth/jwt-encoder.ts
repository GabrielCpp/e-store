import jwt, { VerifyErrors, SignOptions } from 'jsonwebtoken'

export const JWT_ENCODER = Symbol.for('JwtEncoder')
export const JWT_PRIVATE_KEY = Symbol.for('JwtPrivateKey')
export const JWT_PRIVATE_KEY_PASSPHRASE = Symbol.for('JwtPrivateKeyPassphrase')
export const JWT_ENCODER_SIGN_OPTIONS = Symbol.for('JwtEncoderSignOptions')

export interface IJwtEncoder {
    sign(token: object): Promise<string>
}

export class JwtEncoder implements IJwtEncoder {
    public constructor(private secret: string, private passphrase: string, private signOptions: SignOptions) {

    }

    public async sign(payload: object): Promise<string> {
        return await new Promise((resolve, reject) => {
            jwt.sign(payload, { key: this.secret, passphrase: this.passphrase }, this.signOptions, (error, jwtToken) => {
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