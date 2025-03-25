import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  describe,
  it,
  expect,
} from "vitest";
import JournalService from "../../services/journal.service.js";
import ManuscriptService from "../../services/manuscript.service.js";
import { setupDB, teardownDB } from "../utils/database.js";
import { clearDB, connectDB, disconnectDB } from "../../db/index.js";
import { type JournalManuscripts } from "../../types/index.js";
import UserService from "../../services/user.service.js";

beforeAll(async () => {
  await setupDB();
  connectDB();
});

beforeEach(async () => {
  const userAuthId = "123456789"; // not a hash like it should be but for testing it's good enough
  const userId = (await UserService.createUser(userAuthId))!.id;
  await UserService.createUser(userId);
  await ManuscriptService.createManuscripts(irelManuscripts, userId);
  await ManuscriptService.createManuscripts(orgSciManuscripts, userId);
  await ManuscriptService.createManuscripts(ilrrManuscripts, userId);
  await ManuscriptService.createManuscripts(abrManuscripts, userId);
  await ManuscriptService.createManuscripts(
    nonVerifiedJournalManuscripts,
    userId
  );
  await JournalService.createJournal("amr", "Academy of Management Review");
  await JournalService.verifyJournal("irel");
  await JournalService.verifyJournal("orgsci");
  await JournalService.verifyJournal("ilrr");
  await JournalService.verifyJournal("abr");
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await disconnectDB();
  await teardownDB();
});

const irelManuscripts: JournalManuscripts = {
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

const orgSciManuscripts: JournalManuscripts = {
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

const ilrrManuscripts: JournalManuscripts = {
  journalUrlSlug: "ilrr",
  journalName: "ILR Review",
  manuscripts: [
    {
      manuscriptID: "ILRR-01",
      decision: "Accept",
      submissionDate: "9/1/2023",
      decisionDate: "9/21/2023",
    },
    {
      manuscriptID: "ILRR-02.R2",
      decision: "Accept",
      submissionDate: "10/1/2023",
      decisionDate: "10/21/2023",
    },
  ],
};

const abrManuscripts: JournalManuscripts = {
  journalUrlSlug: "abr",
  journalName: "Accounting and Business Research",
  manuscripts: [
    {
      manuscriptID: "ABR-01.R2",
      decision: "Major Revision",
      submissionDate: "9/1/2023",
      decisionDate: "9/29/2023",
    },
  ],
};

const nonVerifiedJournalManuscripts: JournalManuscripts = {
  journalUrlSlug: "nvj",
  journalName: "Nonverified Journal",
  manuscripts: [
    {
      manuscriptID: "NVJ-01.R2",
      decision: "Major Revision",
      submissionDate: "9/1/2023",
      decisionDate: "9/29/2023",
    },
  ],
};

describe("JournalsService.getJournalStats()", () => {
  it("should return stats for journals that are verified and have enough data given no argument", async () => {
    const result = await JournalService.getJournalStats();
    const expected = [
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
      {
        academicField: null,
        avgDaysToFirstDecision: 20,
        distinctManuscripts: 2,
        impactFactor: null,
        journalFullName: "ILR Review",
        pctAcceptedAfterRevision: 100,
        pctReceivedRevisionOnInitialSub: 50,
        stdDaysToFirstDecision: 0,
      },
      {
        academicField: null,
        avgDaysToFirstDecision: null,
        distinctManuscripts: 1,
        impactFactor: null,
        journalFullName: "Accounting and Business Research",
        pctAcceptedAfterRevision: null,
        pctReceivedRevisionOnInitialSub: 100,
        stdDaysToFirstDecision: null,
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(result));
  });

  it("should return the stats of one journal if it is verified and has enough data given the journal ID as argument", async () => {
    const result = await JournalService.getJournalStats("irel");
    const expected = [
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
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(result));
  });
});
