import { type Transaction } from "kysely";
import type { DB } from "../db/schema.js";
import { db } from "../db/index.js";

const FieldService = () => {
  const createField = async (name: string, trx?: Transaction<DB>) => {};

  return {
    createField,
  };
};

export default FieldService();
