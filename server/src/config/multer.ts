import multer from "multer";
import path from "path";
import fs from 'fs';
import crypto from 'crypto'

const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "resumes"
);

if(!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, {
        recursive:true,
    });
}

const storage = multer.diskStorage({
    destination:(_req, _file, cb)=>{
        cb(null, uploadDirectory)
    },

    filename:(_req, file, cb)=>{
        const extension = path.extname(file.originalname).toLowerCase();

        const uniqueName = `${crypto.randomUUID()}${extension}`

        cb(null, uniqueName);
    }
});

const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedExtentions = [".pdf",".docx"]

const fileFilter:multer.Options["fileFilter"] = (
    _req,
    file,
    cb
)=>{
    const extension = path.extname(file.originalname).toLowerCase();

    const isValidMimeType = allowedMimeTypes.includes(
        file.mimetype
    );

    const isValidExtension = allowedExtentions.includes(extension);

    if(!isValidMimeType || !isValidExtension){
        cb(
            new Error("Only PDF and DOCX resume files are allowed")
        );

        return;
    }
    cb(null, true)
}

export const uploadResume = multer({
    storage,
    limits:{
        fileSize: 5*1024*1024,
        files:1
    },
    fileFilter,
})