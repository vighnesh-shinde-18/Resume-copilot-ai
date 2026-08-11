import type {Request, Response, NextFunction} from 'express'
import ApiError from '../utils/ApiError.js'

const errorHandler =(
    error:Error,
    req:Request,
    res:Response,
    next:NextFunction
): void =>{
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
}

export default errorHandler;