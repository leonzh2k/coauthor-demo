import { type UUID } from "node:crypto";
import { db } from "../db/index.js";

const SessionService = () => {
  const getSessionById = async (id: UUID) => {};

  const createSession = async (
    sessionID: UUID,
    userID: string,
    expireAt: Date
  ) => {};

  const deleteSessionById = async (sessionID: UUID) => {};

  const deleteSessionsByUserId = async (userID: string) => {};

  return {
    getSessionById,
    createSession,
    deleteSessionById,
    deleteSessionsByUserId,
  };
};

export default SessionService();
