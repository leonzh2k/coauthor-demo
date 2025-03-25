import process from "node:process";
import "./env.js";
import app from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  logger.info(`Sever running on port ${PORT}`);
});
