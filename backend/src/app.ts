import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'


const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const { PORT = 3000, ORIGIN_ALLOW } = process.env
const app = express()
const corsOptions = { origin: ORIGIN_ALLOW, credentials: true };

app.use(cookieParser());
app.get('/auth/csrf-token', csrfProtection, (req, res) => {
    res.send(req.csrfToken());
});
// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
