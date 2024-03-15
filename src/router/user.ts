import express from "express";

import {getAllUsers, updateUser} from "../controllers/users";
import {isAuthenticated} from "../middlewares";

export default (router: express.Router) => {
    console.log("test");
    router.use(isAuthenticated);
    router.get('/users' , getAllUsers);
    router.put('/users/:id' , updateUser);

};
;