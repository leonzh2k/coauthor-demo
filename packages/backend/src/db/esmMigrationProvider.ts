import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import type { MigrationProvider, Migration } from "kysely";

// See https://github.com/kysely-org/kysely/issues/277
class ESMFileMigrationProvider implements MigrationProvider {
  constructor(readonly relativePath: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const resolvedPath = path.resolve(__dirname, this.relativePath);
    const files = await fs.readdir(resolvedPath);

    for (const fileName of files) {
      if (!fileName.endsWith(".ts")) {
        continue;
      }

      const importPath =
        "./" + path.join(this.relativePath, fileName).replaceAll("\\", "/");
      const migration = await import(importPath);
      const migrationKey = fileName.slice(
        0,
        Math.max(0, fileName.lastIndexOf("."))
      );

      migrations[migrationKey] = migration;
    }

    return migrations;
  }
}

export default ESMFileMigrationProvider;
