import { Application } from '@/app'
import { JWT_ENCODER, IJwtEncoder } from '@/shared'
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios'
import { AddressInfo, Server } from 'net';
import https from 'https'

function makeAxiosTest(axiosInstance: AxiosInstance, server: Server, httpsCaCertificate?: string) {
    const addr = server.address() as AddressInfo
    const port = addr.port;
    const protocol = server instanceof https.Server ? 'https' : 'http';
    const baseUrl = protocol + '://' + 'localhost' + ':' + port
    const httpsAgent = httpsCaCertificate ? new https.Agent({ ca: Buffer.from(httpsCaCertificate, 'base64').toString(), keepAlive: false }) : undefined;

    return async (config: AxiosRequestConfig): Promise<AxiosResponse<any>> => {
        try {
            return await axiosInstance({
                ...config,
                url: baseUrl + config.url,
                httpsAgent
            })
        }
        catch (e) {
            if (e.response) {
                return e.response
            }
            else {
                throw e;
            }
        }
    }
}

describe('API', () => {
    let app: Application;
    let axiostest: (config: AxiosRequestConfig) => AxiosPromise;
    let server: Server
    let jwtEncoder: IJwtEncoder;
    let authHeader: string;

    async function buildAuthHeader(id: string, permissions: string[]): Promise<string> {
        const token = await jwtEncoder.sign({
            id,
            permissions
        })

        return `Bearer ${token}`
    }

    beforeAll(async () => {
        app = new Application()
        server = await app.start()
        jwtEncoder = app.container.get(JWT_ENCODER)
        axiostest = makeAxiosTest(axios, server, process.env.TEST_CA_CERTIFICATE as string);
    })

    afterAll(() => {
        return app.close()
    })

    beforeEach(async () => {
        authHeader = await buildAuthHeader(uuidv4(), ['user.create', 'user.search'])
    })

    test('create user', async () => {
        const userDto = {
            'id': uuidv4(),
            'name': 'test',
            'email': 'test@gmail.com'
        }

        let res = await axiostest({
            method: 'post',
            url: '/api/user',
            data: userDto,
            headers: {
                'Accept': 'application/json',
                'Authorization': authHeader
            }
        })

        expect(res.status).toBe(200);
        expect(res.data).toEqual(userDto)

        res = await axiostest({
            method: 'get',
            url: `/api/user/${userDto.id}`,
            headers: {
                'Authorization': authHeader
            }
        })

        expect(res.data).toEqual(userDto)
    })

    test('create invalid user', async () => {
        const userDto = {
            'name': 'test',
            'email': 'test@gmail.com'
        }

        let res = await axiostest({
            method: 'post',
            url: '/api/user',
            data: userDto,
            headers: {
                'Accept': 'application/json'
            }
        })

        expect(res.status).toBe(400)
    })

    test('find unkown user', async () => {
        const id = uuidv4();
        let res = await axiostest({
            method: 'get',
            url: `/api/user/${id}`,
            headers: {
                'Authorization': authHeader
            }
        })

        expect(res.status).toBe(404)
    })
})