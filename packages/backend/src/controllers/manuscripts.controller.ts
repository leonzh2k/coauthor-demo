import type { Request, Response } from "express";
import ManuscriptsService from "../services/manuscript.service.js";
import { type JournalManuscripts } from "../types/index.js";

const ManuscriptsController = () => {
  const createManuscripts = async (request: Request, response: Response) => {};

  return {
    createManuscripts,
  };
};

export default ManuscriptsController();
