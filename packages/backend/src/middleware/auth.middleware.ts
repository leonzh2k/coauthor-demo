import type { Request, Response, NextFunction } from "express";
import SessionService from "../services/session.service.js";

const AuthMiddleware = () => {
  const checkAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  return { checkAuth };
};

export default AuthMiddleware();
