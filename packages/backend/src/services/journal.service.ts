import { sql, type Transaction } from "kysely";
import { db } from "../db/index.js";
import type { DB } from "../db/schema.js";
import { type JournalStats } from "../../../common/types/index.js";

const JournalService = () => {
  const getJournal = async (urlSlug: string, trx?: Transaction<DB>) => {};

  const getAllJournals = async (trx?: Transaction<DB>) => {};

  const createJournal = async (
    urlSlug: string,
    name: string,
    trx?: Transaction<DB>
  ) => {};

  const verifyJournal = async (url_slug: string, trx?: Transaction<DB>) => {};

  const getJournalStats = async (
    journal?: string
  ): Promise<JournalStats[]> => {};

  return {
    getJournalStats,
    createJournal,
    getJournal,
    verifyJournal,
    getAllJournals,
  };
};

export default JournalService();
