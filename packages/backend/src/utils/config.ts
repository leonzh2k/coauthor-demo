import process from "node:process";

// CORS settings for extension-only requests
const corsOptionsForExtension = {
  origin: process.env.EXTENSION_ORIGIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const PORT = process.env.PORT;

const config = { PORT, corsOptionsForExtension };

export default config;
