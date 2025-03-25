import { type Transaction } from "kysely";
import type { DB } from "../db/schema.js";
import { db } from "../db/index.js";

const JournalFieldService = () => {
  const createJournalField = async (
    journalId: number,
    fieldId: number,
    trx?: Transaction<DB>
  ) => {};

  return {
    createJournalField,
  };
};

export default JournalFieldService();
