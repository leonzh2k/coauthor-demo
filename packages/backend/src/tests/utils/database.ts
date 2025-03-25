#!/usr/bin/env node
import process from "node:process";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import migrate from "../../db/migrate.js";

let postgresContainer: StartedPostgreSqlContainer;
export const setupDB = async () => {
  try {
    postgresContainer = await new PostgreSqlContainer().start();
    process.env.DATABASE_URL = postgresContainer!.getConnectionUri();
    process.env.MIGRATE_ACTION = "latest";
    await migrate();
  } catch (error) {
    console.error("Error during database setup:", error);
    process.exit(1);
  }
};

export const teardownDB = async () => {
  try {
    await postgresContainer.stop();
  } catch (error) {
    console.error("Error during database teardown:", error);
  }
};
