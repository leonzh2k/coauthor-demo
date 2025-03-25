import process from "node:process";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
