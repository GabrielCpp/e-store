const { execSync } = require('child_process')
const { writeFileSync, readFileSync, mkdirSync, existsSync } = require('fs')
const { resolve } = require('path')

function generateExpressTls(configDir) {
    const tlsPassphrase = randomString(10)

    // Create Root Key
    execSync(`openssl genrsa -des3 -out rootCA.key -passout pass:${tlsPassphrase} 4096`, {
        cwd: configDir
    })

    // Create and self sign the Root Certificate
    execSync(`openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -passin pass:${tlsPassphrase} -subj "/C=US/ST=CA/O=Foo, Inc./CN=localhost-authority" -out rootCA.crt`, {
        cwd: configDir
    })

    // Create the certificate key
    execSync('openssl genrsa -out local.key 2048', {
        cwd: configDir
    })

    // Create the signing (csr)
    execSync('openssl req -new -sha256 -key local.key -subj "/C=US/ST=CA/O=MyOrg, Inc./CN=localhost" -out local.csr', {
        cwd: configDir
    })

    // Generate the certificate using the mydomain csr and key along with the CA Root key
    execSync(`openssl x509 -req -in local.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out local.crt -days 500 -sha256 -passin pass:${tlsPassphrase}`, {
        cwd: configDir
    })

    const tlsPrivateKey = Buffer.from(readFileSync(resolve(configDir, 'local.key'))).toString('base64')
    const tlsCertificate = Buffer.from(readFileSync(resolve(configDir, 'local.crt'))).toString('base64')
    const caCertificate = Buffer.from(readFileSync(resolve(configDir, 'rootCA.crt'))).toString('base64')


    return {
        tlsPrivateKey,
        tlsCertificate,
        tlsPassphrase,
        caCertificate
    }
}

function generateJwtKeys(configDir) {
    const passphrase = randomString(10)

    execSync(`openssl genrsa -des3 -out private.pem  -passout pass:${passphrase} 2048`, {
        cwd: configDir
    })

    execSync(`openssl rsa -in private.pem -outform PEM -pubout -passin pass:${passphrase} -out public.pem`, {
        cwd: configDir
    })

    const privateKey = Buffer.from(readFileSync(resolve(configDir, 'private.pem'))).toString('base64')
    const publicKey = Buffer.from(readFileSync(resolve(configDir, 'public.pem'))).toString('base64')

    return {
        privateKey,
        publicKey,
        passphrase
    }
}

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function main() {
    const configDir = './.local-cfg';

    if (!existsSync(configDir)) {
        mkdirSync(configDir, {

        })
    }

    const expressTls = generateExpressTls(configDir)
    const jwtKeys = generateJwtKeys(configDir)

    const testConfig = [
        `TEST_CA_CERTIFICATE = ${expressTls.caCertificate}`
    ]

    const config = [
        `TYPEORM_CONNECTION = mysql`,
        `TYPEORM_HOST = 127.0.0.1`,
        `TYPEORM_USERNAME = creator`,
        `TYPEORM_PASSWORD = ${randomString(10)}`,
        `TYPEORM_DATABASE = appdb`,
        `TYPEORM_PORT = 3306`,
        `TYPEORM_SYNCHRONIZE = true`,
        `TYPEORM_LOGGING = false`,
        `EXPRESS_PORT = 3000`,
        `EXPRESS_TLS_PRIVATE_KEY = ${expressTls.tlsPrivateKey}`,
        `EXPRESS_TLS_CERTIFICATE = ${expressTls.tlsCertificate}`,
        `EXPRESS_TLS_PASSPHRASE = ${expressTls.tlsPassphrase}`,
        `JWT_ENCODER_SIGN_OPTIONS = { "expiresIn": "1h", "algorithm": "RS256" }`,
        `JWT_PRIVATE_KEY_PASSPHRASE = ${jwtKeys.passphrase}`,
        `JWT_PRIVATE_KEY = ${jwtKeys.privateKey}`,
        `JWT_PUBLIC_KEY = ${jwtKeys.publicKey}`
    ]

    writeFileSync('.env.test', config.join('\n'))
    writeFileSync('.env.test', [...config, ...testConfig].join('\n'))
}


main()