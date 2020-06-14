import './controllers'
import * as bodyParser from 'body-parser';
import * as modules from './modules';
import * as entities from '@/infrastructure/entities'
import * as swagger from 'swagger-express-ts';
import express, { Application as ExpressApplication } from 'express'
import { createServer, Server } from 'https'
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { createConnections, Connection } from 'typeorm';
import { noop } from 'lodash'
import { CONTAINER } from './types';
import { logger } from './logger'

interface ExpressConfig {
    port: number;
    tlsPrivateKey: string;
    tlsCertificate: string;
    passphrase: string;
}

export class Application {
    private expressClose: () => void = noop;
    private connections: Connection[] = []
    public container = new Container();
    private expressConfig: ExpressConfig

    public constructor() {
        this.expressConfig = {
            port: parseInt(process.env.EXPRESS_PORT as string),
            tlsPrivateKey: Buffer.from(process.env.EXPRESS_TLS_PRIVATE_KEY as string, 'base64').toString('ascii'),
            tlsCertificate: Buffer.from(process.env.EXPRESS_TLS_CERTIFICATE as string, 'base64').toString('ascii'),
            passphrase: process.env.EXPRESS_TLS_PASSPHRASE as string
        }
    }

    public async close() {
        this.expressClose()
        await Promise.all(this.connections.map(c => c.close()))
    }

    public async build(): Promise<ExpressApplication> {
        this.container.bind<Container>(CONTAINER).toConstantValue(this.container)
        this.container.load(...Object.values(modules))

        let server = new InversifyExpressServer(this.container, null, { rootPath: "/api" });
        server.setConfig(this.configure.bind(this));

        this.connections = await this.buildConnections()

        return server.build();
    }

    public async start(): Promise<Server> {
        const app: ExpressApplication = await this.build()
        const server = createServer({ key: this.expressConfig.tlsPrivateKey, cert: this.expressConfig.tlsCertificate, passphrase: this.expressConfig.passphrase }, app)

        server.listen(this.expressConfig.port, () => {
            logger.info(`Server started on port ${this.expressConfig.port}`)
            this.expressClose = () => server.close()
        });

        return server;
    }

    private configure(app: ExpressApplication): void {
        app.use('/api-docs/swagger', express.static('swagger'));
        app.use(
            '/api-docs/swagger/assets',
            express.static('node_modules/swagger-ui-dist')
        );

        app.use(
            swagger.express({
                definition: {
                    basePath: '/api',
                    info: {
                        title: 'e-store',
                        version: '1.0',
                    },
                    responses: {
                        500: {},
                    },
                },
            })
        );

        app.use(bodyParser.urlencoded({
            extended: true
        }));

        app.use(bodyParser.json());
    }

    private async buildConnections(): Promise<Connection[]> {
        return await createConnections([
            {
                type: process.env.TYPEORM_CONNECTION,
                host: process.env.TYPEORM_HOST,
                port: parseInt(process.env.TYPEORM_PORT || ''),
                username: process.env.TYPEORM_USERNAME,
                password: process.env.TYPEORM_PASSWORD,
                database: process.env.TYPEORM_DATABASE,
                logging: false,
                synchronize: true,
                entities: [
                    ...Object.values(entities)
                ]
            } as any
        ])
    }
}
