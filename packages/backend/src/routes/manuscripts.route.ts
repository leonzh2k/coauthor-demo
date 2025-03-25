import { Router } from "express";
import cors from "cors";
import ManuscriptsController from "../controllers/manuscripts.controller.js";
import ManuscriptsMiddleware from "../middleware/manuscripts.middleware.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import config from "../utils/config.js";

const manuscriptRouter = Router();

manuscriptRouter.post(
  "/",
  cors(config.corsOptionsForExtension),
  AuthMiddleware.checkAuth,
  ManuscriptsMiddleware.validateManuscripts,
  ManuscriptsController.createManuscripts
);

manuscriptRouter.options("/", cors(config.corsOptionsForExtension));

export default manuscriptRouter;
