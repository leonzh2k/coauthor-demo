import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import GoogleAuthService from "../services/googleAuth.service.js";

const SessionMiddleware = () => {
  const jwtSchema = z.string().jwt();
  const validateAuthorizationHeader = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  return {
    validateAuthorizationHeader,
  };
};

export default SessionMiddleware();
