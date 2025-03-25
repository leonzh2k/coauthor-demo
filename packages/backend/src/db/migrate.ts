#!/usr/bin/env node
import { relative } from "node:path";
import process from "node:process";
import pg from "pg";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  type MigrationResultSet,
} from "kysely";
import ESMFileMigrationProvider from "./esmMigrationProvider.js";

const { Pool } = pg;

export default async function migrate() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new ESMFileMigrationProvider(relative(".", "migrations")),
  });

  let migrationResultSet: MigrationResultSet;

  switch (process.env.MIGRATE_ACTION) {
    case "up": {
      migrationResultSet = await migrator.migrateUp();
      break;
    }

    case "down": {
      migrationResultSet = await migrator.migrateDown();
      break;
    }

    case "latest": {
      migrationResultSet = await migrator.migrateToLatest();
      break;
    }

    default: {
      console.error("No migrate action specified.");
      process.exit(1);
    }
  }

  const { error, results } = migrationResultSet;

  if (results !== undefined) {
    for (const it of results) {
      if (it.status === "Success") {
        if (process.env.NODE_ENV !== "test") {
          console.log(
            `migration "${it.migrationName}" was executed successfully`
          );
        }
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    }
  }

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}
