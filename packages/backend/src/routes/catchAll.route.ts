import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";

// Catch all route. Must be registered after all other routes
// (must be last app.use call) or else it would intercept all requests
// for other routes. This handles client-side routed pages.
const catchAllRouter = Router();

catchAllRouter.get("*", (req, res) => {
  res.sendFile(
    path.join(
      fileURLToPath(path.dirname(import.meta.url)),
      "../public/index.html"
    ),
    (err) => {
      if (err) {
        res.status(500).send("500 Internal Server Error");
      }
    }
  );
});

export default catchAllRouter;
