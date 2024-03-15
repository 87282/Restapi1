import express from 'express';

import {deleteUserById, getUser, updateUserById} from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUser();
        console.log((req as any).identity);
        return res.send(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const updateUser = async (req: express.Request<{id: string}>, res: express.Response) => {
    try {
        if(req.body.username)
            await updateUserById(req.params.id, {username: req.body.username});
        if(req.body.email)
            await updateUserById(req.params.id, {email: req.body.email});

        if (req.body.role)
            await updateUserById(req.params.id, {role: req.body.role});
             return res.send(await getUser());


        // const users = await getUser();
        // console.log((req as any).identity);
        // return res.send(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request<{id: string}>, res: express.Response) => {
    try {
        await deleteUserById(req.params.id);
        return res.send(await getUser());
        // const users = await getUser();
        // console.log((req as any).identity);
        // return res.send(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getUserBySessionToken = async (req: express.Request, res: express.Response) => {
    try {
        console.log((req as any).identity);
        return res.send((req as any).identity);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}
