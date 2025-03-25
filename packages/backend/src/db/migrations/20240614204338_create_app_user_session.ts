import { type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  const migration = db.schema.createTable("app_user_session");

  await migration.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema.dropTable("app_user_session").execute();
}
