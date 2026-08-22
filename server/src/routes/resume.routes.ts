import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";

import resumeController from "../controllers/resume.controller.js";

import { uploadResume } from "../config/multer.js";

const router = Router()

router.use(verifyJWT)

router.post("/",
    uploadResume.single("resume"),resumeController.uploadResume
)
router.get("/",resumeController.getMyResumes);
router.get("/:resumeId/parse-status",resumeController.parseStatus);

export default router;