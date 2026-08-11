import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = (func:RequestHandler):RequestHandler => {
    return(
        async (req:Request,res:Response,next:NextFunction):Promise<void> =>{
            try{
                await func(req,res,next)
            }
            catch(error){
                console.error('Captured in asyncHandler ',error)
                next(error)              
            }
        }
    );
}
export default asyncHandler;