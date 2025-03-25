import supertest from "supertest";
import { beforeAll, afterEach, afterAll, describe, it, vi } from "vitest";
import app from "../../app.js";
import { setupDB, teardownDB } from "../utils/database.js";
import { clearDB, connectDB, disconnectDB } from "../../db/index.js";
import GoogleAuthService from "../../services/googleAuth.service.js";

const api = supertest(app);

vi.mock("../../services/googleAuth.service");
// mock auth service so we don't have to actually access google's servers
vi.mocked(GoogleAuthService.extractUserId).mockResolvedValue("303");

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

describe("POST /session", () => {
  it("Sends 200 on valid authorization header", async () => {
    await api
      .post("/api/session")
      .set(
        "Authorization",
        // dummy jwt, not secret
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
      .expect(200);
  });

  it("Returns 400 on missing authorization header", async () => {
    await api.post("/api/session").expect(400);
  });

  it.each([
    "Bear",
    "Bearer",
    "Bearer some-invalid-jwt",
    "Bearer some-invalid-jwt 4",
    // "" empty string is treated like header doesn't exist
  ])("Returns 400 on invalid authorization header", async (val: string) => {
    await api.post("/api/session").set("Authorization", val).expect(400);
  });
});
