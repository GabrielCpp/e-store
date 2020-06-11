import { Application } from '@/app'
import { JWT_ENCODER, IJwtEncoder } from '@/sanityjs'
import request from 'supertest'
import { Application as ExpressApplication } from 'express'
import { v4 as uuidv4 } from 'uuid';

type AsyncAction<T> = (handler: (err: Error, res: T) => void) => void;
function promisified<T>(action: AsyncAction<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        action((err: Error, res: T) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(res)
            }
        })
    })
}

describe('API', () => {
    let app: Application;
    let supertest: request.SuperTest<request.Test>
    let expressApp: ExpressApplication
    let jwtEncoder: IJwtEncoder;

    beforeAll(async () => {
        app = new Application()
        expressApp = await app.start()
        supertest = request(expressApp)
        jwtEncoder = app.container.get(JWT_ENCODER)
    })

    afterAll(() => {
        return app.close()
    })

    async function buildAuthHeader(id: string, permissions: string[]): Promise<string> {
        const token = await jwtEncoder.sign({
            id,
            permissions
        })

        return `Bearer ${token}`
    }

    test('create user', async () => {
        const userDto = {
            'id': uuidv4(),
            'name': 'test',
            'email': 'test@gmail.com'
        }

        const authHeader = await buildAuthHeader(userDto.id, ['user.create']);

        let action: AsyncAction<request.Response> = handler => supertest
            .post('/api/user')
            .send(userDto)
            .set('Accept', 'application/json')
            .set('Authorization', authHeader)
            .expect(200)
            .end(handler)

        let res = await promisified(action);
        expect(res.body).toEqual(userDto)

        action = handler => supertest
            .get(`/api/user/${userDto.id}`)
            .set('Authorization', authHeader)
            .expect(200)
            .end(handler)

        res = await promisified(action);
        expect(res.body).toEqual(userDto)
    })

    test('create invalid user', async () => {
        const userDto = {
            'name': 'test',
            'email': 'test@gmail.com'
        }

        let action: AsyncAction<request.Response> = handler => supertest
            .post('/api/user')
            .send(userDto)
            .set('Accept', 'application/json')
            .expect(400)
            .end(handler)

        let res = await promisified(action);
    })

    test('find unkown user', async () => {
        const id = uuidv4();
        let action: AsyncAction<request.Response> = handler => supertest
            .get(`/api/user/${id}`)
            .expect(404)
            .end(handler)

        await promisified(action);
    })
})