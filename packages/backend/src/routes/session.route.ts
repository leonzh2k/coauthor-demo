import { Router } from "express";
import cors from "cors";
import config from "../utils/config.js";
import SessionController from "../controllers/session.controller.js";
import SessionMiddleware from "../middleware/session.middleware.js";

const sessionRouter = Router();

sessionRouter.get(
  "/",
  cors(config.corsOptionsForExtension),
  SessionController.checkForValidSession
);

sessionRouter.post(
  "/",
  cors(config.corsOptionsForExtension),
  SessionMiddleware.validateAuthorizationHeader,
  SessionController.createSession
);

sessionRouter.delete(
  "/",
  cors(config.corsOptionsForExtension),
  SessionController.deleteSession
);

sessionRouter.options("/", cors(config.corsOptionsForExtension));

export default sessionRouter;
