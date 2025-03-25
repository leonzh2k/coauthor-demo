import { type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema.createTable("decision_type").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema.dropTable("decision_type").execute();
}
