import { Router } from "express";
import cors from "cors";
import JournalsController from "../controllers/journals.controller.js";

const journalRouter = Router();

journalRouter.get("/", cors(), JournalsController.getAllJournalStats);

journalRouter.get(
  "/:journal/stats",
  cors(),
  JournalsController.getOneJournalStats
);

journalRouter.options("/:journal/stats", cors());

export default journalRouter;
