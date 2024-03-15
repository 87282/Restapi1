import express from 'express';

import { login, register } from '../controllers/authentication'

export default () => {
    const authRouter = express.Router()
    authRouter.post('/register', register)
    authRouter.post('/login', login)
    return authRouter;
}