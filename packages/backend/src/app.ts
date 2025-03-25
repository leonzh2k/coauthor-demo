import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";
import { setupExpressErrorHandler } from "@sentry/node";
import express from "express";
import cookieParser from "cookie-parser";
import "express-async-errors";
import manuscriptRouter from "./routes/manuscripts.route.js";
import sessionRouter from "./routes/session.route.js";
import journalRouter from "./routes/journals.route.js";
import catchAllRouter from "./routes/catchAll.route.js";
import { connectDB } from "./db/index.js";

const app = express();

// Connections handled by test file instead when running tests
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Add this after all routes,
// but before any and other error-handling middlewares are defined
setupExpressErrorHandler(app);

app.use(cookieParser());
app.use(
  "/",
  express.static(
    path.join(fileURLToPath(path.dirname(import.meta.url)), "public")
  )
);
app.use(express.json());
app.use("/api/journals", journalRouter);
app.use("/api/manuscripts", manuscriptRouter);
app.use("/api/session", sessionRouter);
app.use(catchAllRouter);

export default app;
