import  jwt  from "jsonwebtoken"; 
import type { JwtPayload } from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import type{ Request, Response, NextFunction } from "express";
import envVariables from "../constants/constants.js";
import userServices from "../services/user.services.js";

const verifyJWT = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const AccessToken = req.cookies?.AccessToken;

    if (!AccessToken) {
        throw new ApiError(401, "Unauthorized Request");
    }
    
    const decodedToken = (jwt.verify(AccessToken, envVariables.access_token_secret)) as JwtPayload
     
    const user = await userServices.findUserById(decodedToken?.id);

    if (!user) {
        throw new ApiError(404, "Invalid Access Token")
    }

    req.user = {id:user._id}
    next()
})

export default verifyJWT;