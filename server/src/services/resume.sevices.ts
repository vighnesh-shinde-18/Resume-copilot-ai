import Resume from "../models/resume.model.js"
import mongoose, {Schema} from "mongoose"
import type {UploadResumeBody} from "../types/resume.types.js"

class ResumeServices{
    uploadResume = async(data:UploadResumeBody)=>{
         
        const resume = await Resume.create({
            userId: new mongoose.Types.ObjectId(data.userId),
            originalName: data.originalName,
            storedName: data.storedName,
            mimeType: data.mimeType,
            size:data.size,
            path:data.path
        })

        
        return resume;
    }

    findResumeById = async(resumeId: string,userId:string)=>{
        const resume = Resume.findOne({
            _id:resumeId,
            userId:new mongoose.Types.ObjectId(userId)
        })
        return resume;
    }

    findUserResumes = async( userId: string)=>{
        const resumes = Resume.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).sort({
            createdAt:-1
        })
        return resumes;
    }
}

const resuemServices = new ResumeServices()
export default resuemServices;

