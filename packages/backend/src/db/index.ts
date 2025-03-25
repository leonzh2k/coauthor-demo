import process from "node:process";
import pg from "pg";
import {
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresDialect,
  PostgresIntrospector,
  PostgresQueryCompiler,
  sql,
} from "kysely";
import type { DB } from "./schema.js";

const { Pool } = pg;

let db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
});

let connectionOpen = false;

const connectDB = () => {
  if (connectionOpen) {
    return;
  }

  // doesn't actually try to connect immediately,
  // only does so when query is executed.
  // So this doesn't error even if the database url points to
  // a database that doesn't exist and only causes an error
  // once you try to execute a query and the db still doesn't exist.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: pool,
    }),
  });

  connectionOpen = true;
};

const disconnectDB = async () => {
  if (connectionOpen) {
    await db.destroy();
    connectionOpen = false;
  }
};

const clearDB = async () => {
  await sql`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname =current_schema()) LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `.execute(db);
};

export { db, connectDB, disconnectDB, clearDB };
