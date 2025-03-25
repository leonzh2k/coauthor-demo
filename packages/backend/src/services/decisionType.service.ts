import { type Transaction } from "kysely";
import type { DB } from "../db/schema.js";
import { db } from "../db/index.js";

const DecisionTypeService = () => {
  const getDecisionType = async (
    decisionName: string,
    trx?: Transaction<DB>
  ) => {};

  const createDecisionType = async (
    name: string,
    classification: string,
    trx?: Transaction<DB>
  ) => {};

  const getAllDecisionTypes = async (trx?: Transaction<DB>) => {};

  return {
    getDecisionType,
    createDecisionType,
    getAllDecisionTypes,
  };
};

export default DecisionTypeService();
