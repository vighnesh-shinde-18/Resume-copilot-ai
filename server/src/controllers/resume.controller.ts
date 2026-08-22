import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import type { ApiResponse } from "../types/apiResponse.types.js";
import type {
  IResume,
  UploadResumeBody,
  UploadResumeResponse,
} from "../types/resume.types.js";
import resumeServices from "../services/resume.sevices.js";
import aiService from "../clients/ai-service.client.js";

class ResumeControllers {
  uploadResume = asyncHandler(
    async (
      req: Request<{}, {}, UploadResumeBody>,
      res: Response<ApiResponse<UploadResumeResponse>>,
    ) => {
      if (!req.file) {
        throw new ApiError(400, "Resume file Required");
      }

      const file = req.file;

      const resume = await resumeServices.uploadResume({
        userId: String(req.user?.id),
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
      });

      this.parseResume(String(resume._id), file);

      return res.status(201).json({
        success: true,
        data: {
          id: String(resume._id),
          originalName: resume.originalName,
          mimeType: resume.mimeType,
          size: resume.size,
          createdAt: resume.createdAt,
        },
        message: "Resume Uploaded Successfully",
      });
    },
  );
  getMyResumes = asyncHandler(
    async (req: Request, res: Response<ApiResponse<IResume[]>>) => {
      const resumes = await resumeServices.findUserResumes(
        String(req.user?.id),
      );

      return res.status(200).json({
        success: true,
        data: resumes,
        message: "Resumes fetched successfully",
      });
    },
  );
  parseResume = async (resumeId: string, file: Express.Multer.File) => {
    try {
      const parsedData = await aiService.parseResume(
        String(file.path),
        String(file.filename),
        String(file.mimetype),
      );

      if (parsedData) {
        await resumeServices.markResumeParsed(resumeId, parsedData.text);
      }
    } catch (error: unknown) {
      const parseError =
        error instanceof Error ? error.message : "Resume parsing failed";

      await resumeServices.markResumeParseFailed(resumeId, parseError);
    }
  };
  parseStatus = async (
    req: Request<{ resumeId: string }, {}, {}, {}>,
    res: Response<
      ApiResponse<{
        resumeId: string;
        status: "pending" | "processing" | "completed" | "failed" | undefined;
      }>
    >,
  ) => {
    const resumeId = req.params.resumeId;
    const resume = await resumeServices.findResumeById(
      resumeId,
      String(req.user?.id),
    );

    if (!resume) {
      throw new ApiError(404, "Resume Not Found");
    }
    return res.status(200).json({
      success: true,
      data: { resumeId: String(resume?.id), status: resume?.parseStatus },
      message: "Resumes Parse Status Fecth successfully",
    });
  };
}

const resumeController = new ResumeControllers();
export default resumeController;
