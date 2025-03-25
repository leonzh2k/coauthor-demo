import { type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema.createTable("yearly_journal_data").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema.dropTable("yearly_journal_data").execute();
}
