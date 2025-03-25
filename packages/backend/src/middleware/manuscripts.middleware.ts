import type { Request, Response, NextFunction } from "express";
import { journalManuscriptsSchema } from "../types/index.js";

const ManuscriptsMiddleware = () => {
  const validateManuscripts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};

  return {
    validateManuscripts,
  };
};

export default ManuscriptsMiddleware();
