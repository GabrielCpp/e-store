import 'reflect-metadata'
import 'module-alias/register'
import { config } from 'dotenv'
import { Application } from './app/app';

config()
const app = new Application()
app.start().catch(console.error)
