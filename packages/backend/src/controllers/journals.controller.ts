import type { Request, Response } from "express";
import JournalsService from "../services/journal.service.js";

const JournalsController = () => {
  const getAllJournalStats = async (request: Request, response: Response) => {};

  const getOneJournalStats = async (request: Request, response: Response) => {};

  return {
    getAllJournalStats,
    getOneJournalStats,
  };
};

export default JournalsController();
