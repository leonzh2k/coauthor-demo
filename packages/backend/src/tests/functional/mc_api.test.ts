import supertest from "supertest";
import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  describe,
  it,
  vi,
  test,
  expect,
} from "vitest";
import app from "../../app.js";
import { setupDB, teardownDB } from "../utils/database.js";
import { clearDB, connectDB, disconnectDB } from "../../db/index.js";
import GoogleAuthService from "../../services/googleAuth.service.js";
import JournalService from "../../services/journal.service.js";

const api = supertest(app);

vi.mock("../../services/googleAuth.service");
let sessionCookie = "";

beforeAll(async () => {
  await setupDB();
  connectDB();
});

beforeEach(async () => {
  // Authenticate user
  // mock auth service so we don't have to actually access google's servers
  vi.mocked(GoogleAuthService.extractUserId).mockResolvedValue("303");

  const authResponse = await api
    .post("/api/session")
    .set(
      "Authorization",
      // dummy jwt, not secret
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    )
    .expect(200);

  sessionCookie = authResponse.header["set-cookie"][0];
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await disconnectDB();
  await teardownDB();
});

describe("POST /manuscripts", () => {
  it("Returns 400 on non-object body", async () => {
    const body: any[] = [];
    await api
      .post("/api/manuscripts")
      .set("Cookie", [sessionCookie])
      .send(body)
      .expect(400);
  });

  it.each([
    [
      {
        journalUrlSlug: 12_456,
        journalName: "Industrial Relations",
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: {},
        journalName: "Industrial Relations",
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: [],
        journalName: "Industrial Relations",
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: null,
        journalName: "Industrial Relations",
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: undefined,
        journalName: "Industrial Relations",
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: true,
        journalName: "Industrial Relations",
        manuscripts: [],
      },
    ],
  ])("Returns 400 on non-string journal ID", async (body: any) => {
    await api
      .post("/api/manuscripts")
      .set("Cookie", [sessionCookie])
      .send(body)
      .expect(400);
  });

  it.each([
    [
      {
        journalUrlSlug: "irel",
        journalName: 12_456,
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: "irel",
        journalName: {},
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: "irel",
        journalName: [],
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: "irel",
        journalName: null,
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: "irel",
        journalName: undefined,
        manuscripts: [],
      },
    ],
    [
      {
        journalUrlSlug: "irel",
        journalName: true,
        manuscripts: [],
      },
    ],
  ])("Returns 400 on non-string journal name", async (body: any) => {
    await api
      .post("/api/manuscripts")
      .set("Cookie", [sessionCookie])
      .send(body)
      .expect(400);
  });

  it("Returns 400 on manuscript array length > 50", async () => {
    const body = {
      journalUrlSlug: "irel",
      journalName: "Industrial Relations",
      manuscripts: Array.from({ length: 51 }).fill({}),
    };

    await api
      .post("/api/manuscripts")
      .set("Cookie", [sessionCookie])
      .send(body)
      .expect(400);
  });

  it("Returns 400 on manuscript array length == 0", async () => {
    const body = {
      journalUrlSlug: "irel",
      journalName: "Industrial Relations",
      manuscripts: [],
    };

    await api
      .post("/api/manuscripts")
      .set("Cookie", [sessionCookie])
      .send(body)
      .expect(400);
  });

  it.each([
    [
      {
        journalUrlSlug: "irel",
        journalName: "Industrial Relations",
        manuscripts: [
          {
            manuscriptID: "IREL-01",
            // decision: "Reject",
            submissionDate: "1/1/2023",
            decisionDate: "2/1/2023",
          },
        ],
      },
    ],
    [
      {
        journalUrlSlug: "irel",
        journalName: "Industrial Relations",
        manuscripts: [
          {
            manuscriptID: "IREL-01",
            decision: "Reject",
            submissionDate: "1/1/2023",
            decisionDate: "2/1/2023",
            status: "reject",
          },
        ],
      },
    ],
    [
      {
        journalUrlSlug: "irel",
        journalName: "Industrial Relations",
        manuscripts: [
          {
            manuscriptID: "IREL-01",
            decision: "Reject",
            submissionDate: "1/1/2023",
            decisionDates: "2/1/2023",
          },
        ],
      },
    ],
  ])(
    "Returns 400 when manuscripts do not conform to required structure",
    async (body: any) => {
      await api
        .post("/api/manuscripts")
        .set("Cookie", [sessionCookie])
        .send(body)
        .expect(400);
    }
  );
});

test("it should not accept a manuscript from before 1970", async () => {
  const body = {
    journalUrlSlug: "irel",
    journalFullName: "Industrial Relations",
    manuscripts: [
      {
        manuscriptID: "IREL-01",
        decision: "Reject",
        submissionDate: "1/1/1969",
        decisionDate: "3/1/1969",
      },
    ],
  };

  await api
    .post("/api/manuscripts")
    .set("Cookie", [sessionCookie])
    .send(body)
    .expect(400);
});

test("it should not accept a manuscript from more than +1 years in the future", async () => {
  const twoYearsFromNow = new Date().getFullYear() + 2;
  const body = {
    journalUrlSlug: "irel",
    journalFullName: "Industrial Relations",
    manuscripts: [
      {
        manuscriptID: "IREL-01",
        decision: "Reject",
        submissionDate: "1/1/2023",
        decisionDate: `2/1/${twoYearsFromNow}`,
      },
    ],
  };

  await api
    .post("/api/manuscripts")
    .set("Cookie", [sessionCookie])
    .send(body)
    .expect(400);
});

test("it should return status code 200 when attempting to re-post existing manuscripts", async () => {
  const body = {
    journalUrlSlug: "irel",
    journalName: "Industrial Relations",
    manuscripts: [
      {
        manuscriptID: "ILR-1-1",
        decision: "Reject",
        submissionDate: "1/1/2023",
        decisionDate: "1/4/2023",
      },
      {
        manuscriptID: "ILR-2-2",
        decision: "Reject",
        submissionDate: "4/1/2023",
        decisionDate: "5/4/2023",
      },
    ],
  };

  await api
    .post("/api/manuscripts")
    .set("Cookie", [sessionCookie])
    .send(body)
    .expect(200);
});

test("Returns correct journal statistics when receiving \
          manuscript versions out of chronological order", async () => {
  const body = {
    journalUrlSlug: "test",
    journalName: "testJournal",
    manuscripts: [
      {
        manuscriptID: "MANUSCRIPT.R2",
        decision: "Accept",
        submissionDate: "10/1/2023",
        decisionDate: "11/15/2023",
      },
      {
        manuscriptID: "MANUSCRIPT.R1",
        decision: "Major Revision",
        submissionDate: "7/1/2023",
        decisionDate: "8/7/2023",
      },
      {
        manuscriptID: "MANUSCRIPT",
        decision: "Major Revision",
        submissionDate: "5/1/2023",
        decisionDate: "5/22/2023",
      },
    ],
  };

  await api
    .post("/api/manuscripts")
    .set("Cookie", [sessionCookie])
    .send(body)
    .expect(200);

  await JournalService.verifyJournal("test");

  const getJournals = await api.get("/api/journals").expect(200);

  expect(getJournals.body).toEqual(
    expect.arrayContaining([
      {
        academicField: null,
        avgDaysToFirstDecision: 21,
        distinctManuscripts: 1,
        impactFactor: null,
        journalFullName: "testJournal",
        pctAcceptedAfterRevision: 100,
        pctReceivedRevisionOnInitialSub: 100,
        stdDaysToFirstDecision: 0,
      },
    ])
  );
});
