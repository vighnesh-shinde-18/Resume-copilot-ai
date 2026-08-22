import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestHeaders,
} from "axios";
import FormData from "form-data";
import fs from "fs";

import ApiError from "../utils/ApiError.js";
import type { ResumeParseResponse } from "../types/ai-service.types.js";
import envVariables from "../constants/constants.js";

class AiService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: envVariables.ai_service_url,
      timeout: Number(envVariables.ai_service_timeout),
      headers: {
        Accept: "application/json",
      },
    });
  }

  private handleError = (error: unknown): never => {
    if (!axios.isAxiosError(error)) {
      throw new ApiError(503, "AI service communication failed");
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      throw new ApiError(504, "AI service request timed out");
    }

    if (!error.response) {
      throw new ApiError(503, "AI service is currently unavailable");
    }

    const status = error.response.status;

    if (status >= 400 && status < 500) {
      throw new ApiError(400, "AI service rejected the resume");
    }

    if (status >= 500) {
      throw new ApiError(503, "AI service failed to process the resume");
    }

    throw new ApiError(503, "Unexpected AI service response");
  };

  parseResume = async (
    filePath: string,
    fileName: string,
    mimeType: string,
  ): Promise<ResumeParseResponse> => {
    const form = new FormData();

    form.append("file", fs.createReadStream(filePath), {
      filename: fileName,
      contentType: mimeType,
    });

    try {
      const response = await this.client.post<ResumeParseResponse>(
        "/resumes/parse",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
          maxContentLength: 10 * 1024 * 1024,
          maxBodyLength: 10 * 1024 * 1024,
        },
      );

      return response.data;
    } catch (error: unknown) {
      return this.handleError(error);
    }
  };
}

const aiService = new AiService();
export default aiService;
