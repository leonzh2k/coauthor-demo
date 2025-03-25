import { type Transaction } from "kysely";
import { db } from "../db/index.js";
import type { DB } from "../db/schema.js";
import { type JournalManuscripts } from "../types/index.js";
import JournalsService from "./journal.service.js";
import ManuscriptVersionService from "./manuscriptVersion.service.js";
import DecisionTypesService from "./decisionType.service.js";
import UserManuscriptService from "./userManuscript.service.js";

const ManuscriptService = () => {
  const getManuscriptById = async (
    manuscriptId: string,
    trx?: Transaction<DB>
  ) => {};

  const getAllManuscripts = async (trx?: Transaction<DB>) => {};

  const createManuscript = async (
    journalAssignedId: string,
    journalId: number,
    trx?: Transaction<DB>
  ) => {};

  const createManuscripts = async (
    manuscriptData: JournalManuscripts,
    userID: string
  ) => {};

  return {
    getManuscriptById,
    createManuscripts,
    getAllManuscripts,
  };
};

export default ManuscriptService();
