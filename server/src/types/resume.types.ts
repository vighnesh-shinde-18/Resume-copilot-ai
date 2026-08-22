import mongoose, { Document} from "mongoose"

export interface IResume extends Document{
    userId: mongoose.Types.ObjectId;
    originalName : string;
    storedName: string;
    mimeType : string;
    size:number;
    path:string;
    parseStatus:"pending" | "processing" | "completed" | "failed";
    parsedText?:string;
    parseError?:string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UploadResumeBody{
    userId:string;
    originalName:string;
    storedName:string;
    mimeType:string;
    size:number;
    path:string; 
}
export interface UploadResumeResponse{
    id:string;
    originalName:string; 
    mimeType:string;
    size:number;
    createdAt:Date
}
 