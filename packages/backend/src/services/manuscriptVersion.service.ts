import { type Transaction } from "kysely";
import type { DB } from "../db/schema.js";
import { db } from "../db/index.js";

const ManuscriptVersionService = () => {
  const createManuscriptVersion = async (
    manuscriptId: string,
    version: number,
    decisionTypeId: number,
    submissionDate: string,
    decisionDate: string,
    trx?: Transaction<DB>
  ) => {};

  const getManuscriptVersion = async (
    manuscriptId: string,
    version: number,
    trx?: Transaction<DB>
  ) => {};

  const getAllManuscriptVersions = async (trx?: Transaction<DB>) => {};

  return {
    createManuscriptVersion,
    getManuscriptVersion,
    getAllManuscriptVersions,
  };
};

export default ManuscriptVersionService();
