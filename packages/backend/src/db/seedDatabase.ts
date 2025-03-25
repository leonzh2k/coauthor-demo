import "../env.js";
import { type JournalManuscripts } from "../types/index.js";
import JournalService from "../services/journal.service.js";
import UserService from "../services/user.service.js";
import ManuscriptService from "../services/manuscript.service.js";
import fieldService from "../services/field.service.js";
import journalFieldService from "../services/journalField.service.js";
import { connectDB, disconnectDB } from "./index.js";

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

connectDB();

const irelId = (await JournalService.createJournal(
  irelManuscripts.journalUrlSlug,
  irelManuscripts.journalName
))!.id;
const orgSciId = (await JournalService.createJournal(
  orgSciManuscripts.journalUrlSlug,
  orgSciManuscripts.journalName
))!.id;
const ilrrId = (await JournalService.createJournal(
  ilrrManuscripts.journalUrlSlug,
  ilrrManuscripts.journalName
))!.id;

const userAuthId = "123456789"; // not a hash like it should be but for testing it's good enough
const userId = (await UserService.createUser(userAuthId))!.id;
await UserService.createUser(userId);
await ManuscriptService.createManuscripts(irelManuscripts, userId);
await ManuscriptService.createManuscripts(orgSciManuscripts, userId);
await ManuscriptService.createManuscripts(ilrrManuscripts, userId);
await ManuscriptService.createManuscripts(abrManuscripts, userId);

await JournalService.verifyJournal(irelManuscripts.journalUrlSlug);
await JournalService.verifyJournal(orgSciManuscripts.journalUrlSlug);
await JournalService.verifyJournal(ilrrManuscripts.journalUrlSlug);
await JournalService.verifyJournal(abrManuscripts.journalUrlSlug);

const laborRelId = (await fieldService.createField("Labor Relations"))!.id;
const psychId = (await fieldService.createField("Psychology"))!.id;

await journalFieldService.createJournalField(irelId, laborRelId);
await journalFieldService.createJournalField(ilrrId, laborRelId);
await journalFieldService.createJournalField(orgSciId, psychId);

await disconnectDB();
