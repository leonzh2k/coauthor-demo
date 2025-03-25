import { type Transaction } from "kysely";
import { db } from "../db/index.js";
import type { DB } from "../db/schema.js";

const UserManuscriptService = () => {
  const createUserManuscript = async (
    userId: string,
    manuscriptId: string,
    trx?: Transaction<DB>
  ) => {};

  const getUserManuscriptById = async (
    userId: string,
    manuscriptId: string,
    trx?: Transaction<DB>
  ) => {};

  const getAllUserManuscripts = async (trx?: Transaction<DB>) => {};

  return {
    createUserManuscript,
    getUserManuscriptById,
    getAllUserManuscripts,
  };
};

export default UserManuscriptService();
