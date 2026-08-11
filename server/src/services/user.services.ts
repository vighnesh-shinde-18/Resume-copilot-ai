import User from "../models/user.model.js";
import type { ObjectId } from "mongoose";

class UserServices{
    findUser = async(email:string,username:string="")=>{
       const user =  await User.findOne({
            $or:[{email},{username}]
        }).select("+password") 
        return user;
    }

    findUserById = async(id:string)=>{
        const user = await User.findById(id).select("-password")
        return user;
    }

    createUser = async(userInfo:{username:string,email:string,password:string})=>{
       const user = await User.create(userInfo)
       return user;
    }
    
}

const userServices = new UserServices();

export default userServices;