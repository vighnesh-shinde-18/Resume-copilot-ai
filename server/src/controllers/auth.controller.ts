import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import type {
  RegisterUserBody,
  RegisterUserResponse,
  LoginUserBody,
  LoginUserResponse,
} from "../types/auth.types.js";
import userServices from "../services/user.services.js"; 
import type { ApiResponse } from "../types/apiResponse.types.js";
import User from "../models/user.model.js";

class AuthControllers {
  register = asyncHandler(
    async (
      req: Request<{}, {}, RegisterUserBody>,
      res: Response<ApiResponse<RegisterUserResponse>>,
    ) => {
      const { username, email, password } = req.body;

      if ([username, email, password].some((field) => !field.trim())) {
        throw new ApiError(400, "All fields are Required");
      }

      const existingUser = await userServices.findUser(username, email);
      
      if (!existingUser) {
        throw new ApiError(409, "User Already Exist");
      }

      const userInfo = {
        username,
        email,
        password,
      };
      const createdUser = await userServices.createUser(userInfo);
      if (!createdUser) {
        throw new ApiError(500, "Something went Wrong While Registering User");
      }

      return res.status(201).json({
        success: true,
        message: "User Regsitered Successfully",
        data: {
          username: createdUser.username,
          email: createdUser.email,
        },
      });
    },
  );

  login = asyncHandler(
    async (
      req: Request<{}, {}, LoginUserBody>,
      res: Response<ApiResponse<LoginUserResponse>>,
    ) => {
      const { email, password } = req.body;

      if ([email, password].some((field) => !field.trim())) {
        throw new ApiError(400, "All fields are Required");
      }

      const user = await userServices.findUser(email);
        
      if (!user) {
        throw new ApiError(401, "Invalid Credentials");
      }
 
    const isPaaswordCorrect = await user.isPasswordCorrect(password);
   
      
      if (!isPaaswordCorrect) {
        throw new ApiError(401, "Invalid Credentials");
      }

      const accessToken = user.generateAccessToken();

      return res
        .status(200)
        .cookie("AccessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite:"none",
      })
        .json({
          success: true,
          data: { username:user.username, email:user.email },
          message: "User LoggedIn Successfully",
        });
    },
  );
}

const authControllers = new AuthControllers();

export default authControllers;
