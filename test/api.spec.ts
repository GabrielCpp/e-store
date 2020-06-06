import { Application } from '@/app/app'
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

    beforeAll(async () => {
        app = new Application()
        expressApp = await app.start()
        supertest = request(expressApp)
    })

    afterAll(() => {
        return app.close()
    })

    test('create user', async () => {
        const userDto = {
            'id': uuidv4(),
            'name': 'test',
            'email': 'test@gmail.com'
        }

        let action: AsyncAction<request.Response> = handler => supertest
            .post('/user')
            .send(userDto)
            .set('Accept', 'application/json')
            .expect(200)
            .end(handler)

        let res = await promisified(action);
        expect(res.body).toEqual(userDto)

        action = handler => supertest
            .get(`/user/${userDto.id}`)
            .expect(200)
            .end(handler)

        res = await promisified(action);
        expect(res.body).toEqual(userDto)
    })
})