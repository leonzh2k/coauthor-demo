import { type UUID, randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import SessionService from "../services/session.service.js";
import UserService from "../services/user.service.js";

const SessionController = () => {
  const createSession = async (request: Request, response: Response) => {};

  const deleteSession = async (req: Request, res: Response) => {};

  const checkForValidSession = async (req: Request, res: Response) => {};

  return {
    createSession,
    deleteSession,
    checkForValidSession,
  };
};

export default SessionController();
