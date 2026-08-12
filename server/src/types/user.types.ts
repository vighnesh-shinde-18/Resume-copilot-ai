import { Document, Model } from "mongoose";

export interface IUser extends Document{
    username:string;
    email:string;
    password:string;
    createdAt:Date;
    updatedAt:Date;
}

export interface IUserMethods extends Document{
    isPasswordCorrect(password:string): Promise<boolean>;
    generateAccessToken():string;
}

export type UserModel = Model<IUser,{},IUserMethods>