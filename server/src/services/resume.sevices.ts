import Resume from "../models/resume.model.js"
import mongoose from "mongoose"
import type {UploadResumeBody} from "../types/resume.types.js"
import aiService from "../clients/ai-service.client.js"

class ResumeServices{
    uploadResume = async(data:UploadResumeBody)=>{
        const resume = await Resume.create({
            userId: new mongoose.Types.ObjectId(data.userId),
            originalName: data.originalName,
            storedName: data.storedName,
            mimeType: data.mimeType,
            size:data.size,
            path:data.path,
            parseStatus:"processing" 
        })
        return resume;
    }
    findResumeById = async(resumeId: string,userId:string)=>{
        const resume = await Resume.findOne({
            _id:new mongoose.Types.ObjectId(resumeId),
            userId:new mongoose.Types.ObjectId(userId)
        })
        return resume;
    }
    findUserResumes = async( userId: string)=>{
        const resumes = await Resume.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).sort({
            createdAt:-1
        })
        return resumes;
    }
    parseResume = async(
        filePath:string,
        fileName:string,
        mimeType:string
    )=>{
        const parsedResume = await aiService.parseResume(filePath, fileName, mimeType);

        return parsedResume;
    }
    markResumeParsed = async(resumeId:string, parsedText:string)=>{
        await Resume.findByIdAndUpdate(
            resumeId,
            {
                $set:{
                    parseStatus:"completed",
                    parsedText,
                    parsedAt: new Date(),
                },
                $unset:{
                    parseError:1
                }
            },
            {
                new :true
            }
        ); 
    };
    markResumeParseFailed = async(resumeId:string, parseError:string)=>{
        await Resume.findByIdAndUpdate(
            resumeId,
            {
                $set:{
                    parseStatus:"failed",
                    parseError:parseError
                }
            },
            {
                new : true
            }
        ) 
    }
}
const resuemServices = new ResumeServices()
export default resuemServices;

