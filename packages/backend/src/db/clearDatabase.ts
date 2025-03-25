import process from "node:process";
import pg from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";
import "../env.js";
import type { DB } from "./schema.js";

const { Pool } = pg;

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

// https://stackoverflow.com/questions/2829158/truncating-all-tables-in-a-postgres-database
const clearDB = async () => {
  await sql`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname =current_schema()) LOOP
      IF r.tablename = 'kysely_migration' THEN 
      CONTINUE;
      ELSE
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
        END IF;
      END LOOP;
    END $$;
  `.execute(db);
};

await clearDB();
await db.destroy();
