import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest";
import { setupDB, teardownDB } from "../utils/database.js";
import { clearDB, connectDB, disconnectDB } from "../../db/index.js";
import JournalService from "../../services/journal.service.js";

beforeAll(async () => {
  await setupDB();
  connectDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await disconnectDB();
  await teardownDB();
});

describe("JournalService", () => {
  describe("createJournal()", () => {
    it("should create unverified journals by default", async () => {
      const result = await JournalService.createJournal(
        "irel",
        "Industrial Relations"
      );
      expect(result).toStrictEqual({
        id: 1,
        name: "Industrial Relations",
      });
    });
  });
});
