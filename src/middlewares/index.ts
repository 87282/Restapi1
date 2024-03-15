import express from 'express';
import { get, merge } from 'lodash'

import { GetUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        console.log("test");

        const sessionToken = req.cookies['LARS-AUTH'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await GetUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });
        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);

    }
}

