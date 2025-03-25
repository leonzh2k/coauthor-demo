import { relative } from "node:path";
import process from "node:process";
import pg from "pg";
import { Kysely, Migrator, PostgresDialect } from "kysely";
import "../env.js";
import ESMFileMigrationProvider from "./esmMigrationProvider.js";

const { Pool } = pg;

async function checkMigrationStatus() {
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

  console.log(await migrator.getMigrations());

  await db.destroy();
}

await checkMigrationStatus();
