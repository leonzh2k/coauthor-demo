import supertest from "supertest";
import {
  beforeAll,
  afterEach,
  afterAll,
  describe,
  it,
  vi,
  expect,
} from "vitest";
import app from "../../app.js";
import { setupDB, teardownDB } from "../utils/database.js";
import GoogleAuthService from "../../services/googleAuth.service.js";
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

const api = supertest(app);
vi.mock("../../services/googleAuth.service");

describe("User Story 1", () => {
  it("Client can authenticate, upload valid manuscripts, and request journals", async () => {
    // mock auth service so we don't have to actually access google's servers
    vi.mocked(GoogleAuthService.extractUserId).mockResolvedValue("303");

    // authenticate
    const authResponse = await api
      .post("/api/session")
      .set(
        "Authorization",
        // dummy jwt, not secret
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
      .expect(200);

    const cookie = authResponse.header["set-cookie"][0] as string;
    const cookieTokens = cookie.split(";")[0].split("=");
    // const cookie = authResponse.header["set-cookie"][0].split(";")[0].split("=") as string[];
    // check cookie name is correct
    expect(cookieTokens[0]).toBe("id");
    // check cookie value is valid UUIDv4
    expect(cookieTokens[1]).toMatch(
      /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i
    );

    const sessionCookie = authResponse.header["set-cookie"][0];

    const irelManuscripts = {
      journalUrlSlug: "irel",
      journalName: "Industrial Relations",
      manuscripts: [
        {
          manuscriptID: "IREL-01.R1",
          decision: "Accept",
          submissionDate: "1/1/2023",
          decisionDate: "2/20/2023",
        },
        {
          manuscriptID: "IREL-01",
          decision: "Minor Revision",
          submissionDate: "3/1/2023",
          decisionDate: "4/10/2023",
        },
        {
          manuscriptID: "IREL-02.R1",
          decision: "Reject",
          submissionDate: "4/1/2023",
          decisionDate: "5/21/2023",
        },
        {
          manuscriptID: "IREL-02",
          decision: "Major Revision",
          submissionDate: "6/1/2023",
          decisionDate: "9/29/2023",
        },
      ],
    };

    await api
      .post("/api/manuscripts")
      .set("Cookie", sessionCookie)
      .send(irelManuscripts)
      .expect(200);

    const { body: irelStats } = await api.get("/api/journals/irel/stats");

    expect(irelStats).toStrictEqual({
      "% Initial Submit => 1st R&R": "No Data",
      "Accept % | 1stRR": "No Data",
      "Avg. Days to 1st Decision": "No Data",
      "Standard Deviation": "No Data",
    });

    await JournalService.verifyJournal("irel");

    const getIrelJournals = await api
      .get("/api/journals/irel/stats")
      .expect(200);

    expect(getIrelJournals.body).toStrictEqual({
      "% Initial Submit => 1st R&R": 100,
      "Accept % | 1st R&R": 50,
      "Avg. Days to 1st Decision": 80,
      "Standard Deviation": 40,
    });

    const orgSciManuscripts = {
      journalUrlSlug: "orgsci",
      journalName: "Organizational Science",
      manuscripts: [
        {
          manuscriptID: "ORGSCI-01",
          decision: "Major Revision",
          submissionDate: "7/1/2023",
          decisionDate: "8/10/2023",
        },
        {
          manuscriptID: "ORGSCI-01.R1",
          decision: "Accept",
          submissionDate: "9/1/2023",
          decisionDate: "10/21/2023",
        },
      ],
    };

    await api
      .post("/api/manuscripts")
      .set("Cookie", sessionCookie)
      .send(orgSciManuscripts)
      .expect(200);

    expect((await api.get("/api/journals/orgsci/stats")).body).toStrictEqual({
      "% Initial Submit => 1st R&R": "No Data",
      "Accept % | 1stRR": "No Data",
      "Avg. Days to 1st Decision": "No Data",
      "Standard Deviation": "No Data",
    });

    await JournalService.verifyJournal("orgsci");

    const getOrgSciJournals = await api
      .get("/api/journals/orgsci/stats")
      .expect(200);

    expect(getOrgSciJournals.body).toStrictEqual({
      "% Initial Submit => 1st R&R": 100,
      "Accept % | 1st R&R": 100,
      "Avg. Days to 1st Decision": 40,
      "Standard Deviation": 0,
    });

    const getAllJournals = await api.get("/api/journals").expect(200);

    expect(getAllJournals.body).toEqual(
      expect.arrayContaining([
        {
          academicField: null,
          avgDaysToFirstDecision: 80,
          distinctManuscripts: 2,
          impactFactor: null,
          journalFullName: "Industrial Relations",
          pctAcceptedAfterRevision: 50,
          pctReceivedRevisionOnInitialSub: 100,
          stdDaysToFirstDecision: 40,
        },
        {
          academicField: null,
          avgDaysToFirstDecision: 40,
          distinctManuscripts: 1,
          impactFactor: null,
          journalFullName: "Organizational Science",
          pctAcceptedAfterRevision: 100,
          pctReceivedRevisionOnInitialSub: 100,
          stdDaysToFirstDecision: 0,
        },
      ])
    );
  });
});
