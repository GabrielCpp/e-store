import 'reflect-metadata'
import 'module-alias/register'
import { config } from 'dotenv'
import { Application } from './app';

config()
const app = new Application()
app.start().catch(e => {
    console.error(e)
    process.exit(1);
})
