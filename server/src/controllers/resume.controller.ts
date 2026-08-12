import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import type { ApiResponse } from "../types/apiResponse.types.js";
import type {IResume, UploadResumeBody, UploadResumeResponse} from "../types/resume.types.js"
import resumeServices from '../services/resume.sevices.js'

class ResumeControllers{
    uploadResume = asyncHandler(
        async(
            req:Request<{},{},UploadResumeBody>,
            res:Response<ApiResponse<UploadResumeResponse>>
        )=>{

            if(!req.file){
                throw new ApiError(400,"Resume file Required")
            };

            const file = req.file;
 
            const resume = await resumeServices.uploadResume({
                userId:String(req.user?.id),
                originalName:file.originalname,
                storedName:file.filename,
                mimeType:file.mimetype,
                size:file.size,
                path:file.path
            })
           

            return res.status(201).json({
                success:true,
                data:{
                    id:String(resume._id),
                    originalName:resume.originalName,
                    mimeType:resume.mimeType,
                    size:resume.size,
                    createdAt:resume.createdAt
                },
                message:"Resume Uploaded Successfully"
            })
        }
    )

    getMyResumes = asyncHandler(
        async(
            req:Request,
            res:Response<ApiResponse<IResume[]>>
        )=>{
            const resumes = await resumeServices.findUserResumes(String(req.user?.id))

            return res.status(200).json({
                success:true,
                data: resumes,
                message:"Resumes fetched successfully"
            })
        }
    )

    // getResume = asyncHandler(
    //     async(
    //         req:
    //     )
    // )

}

const resumeController = new ResumeControllers()
export default resumeController;