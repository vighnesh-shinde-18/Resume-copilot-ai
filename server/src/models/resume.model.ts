import mongoose, {Schema, model} from 'mongoose'
import type { IResume } from '../types/resume.types.js'
 

const resumeSchema = new Schema<IResume>({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    originalName:{
        type:String,
        required:true,
        trim:true
    },
    storedName:{
        type:String,
        required:true,
        unique:true
    },
    mimeType:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    path:{
        type:String,
        required:true
    }
}, {timestamps:true})

const Resume = model<IResume>('Resume', resumeSchema)
export default Resume;