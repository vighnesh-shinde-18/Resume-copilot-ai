import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import type {IUser, IUserMethods, UserModel} from "../types/user.types.js"
import envVariables from "../constants/constants.js";
import jwt from 'jsonwebtoken'


const userSchema = new Schema<IUser,UserModel,IUserMethods>({
    username: { type: String, required: true, unique: true, trim: true,index:true },
    email:{type: String, required: true, trim: true, unique: true, lowercase:true, index:true},
    password: { type: String, required: [true, "Password is Required"], select:false}
}, { timestamps: true });

 
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return ; 
    this.password = await bcrypt.hash(String(this.password),10) 
})

userSchema.methods.isPasswordCorrect = async function(password:string) {
    const isCorrect = await bcrypt.compare(password, String(this.password))
    return isCorrect; 
};

userSchema.methods.generateAccessToken =  function() {
    const payload = {id:this._id, email:this.email,username: this.username}

    const secret = envVariables.access_token_secret

    const options ={
        expiresIn:envVariables.access_token_expire
    } 
    const token = jwt.sign(payload, secret,options)
    return token;
};

const User = model<IUser,UserModel>('User',userSchema);
export default User;