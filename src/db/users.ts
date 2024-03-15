import mongoose from "mongoose";
import express from "express";

const UserSchema = new mongoose.Schema({
    username: { type: String, requiredd: true },
    email: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },

    },
});

export const UserModel = mongoose.model('User', UserSchema);
export const getUser = () => UserModel.find();
export const GetUserByEmail = (email: string) => UserModel.findOne({ email });
export const GetUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const GetUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

export const getMe = (req: express.Request, res: express.Response) => {
    return res.send((req as any).identity);
}