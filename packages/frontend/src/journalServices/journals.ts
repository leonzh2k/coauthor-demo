import axios from "axios";
import { type JournalStats } from "../../../common/types/index.js";

const getAll = async (): Promise<JournalStats[]> => {
  const request = axios.get("/api/journals");
  return request.then((result) => result.data as JournalStats[]);
};

const journalServices = {
  getAll,
};

export default journalServices;
