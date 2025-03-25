import { z } from "zod";

const manuscriptSchema = z
  .object({
    manuscriptID: z.string(),
    decision: z.string(),
    submissionDate: z.string(),
    decisionDate: z.string(),
  })
  .strict();

const journalManuscriptsSchema = z
  .object({
    journalUrlSlug: z.string(),
    journalName: z.string(),
    manuscripts: z.array(manuscriptSchema).max(50).min(1),
  })
  .strict();

type Manuscript = z.infer<typeof manuscriptSchema>;
type JournalManuscripts = z.infer<typeof journalManuscriptsSchema>;

export {
  type Manuscript,
  type JournalManuscripts,
  manuscriptSchema,
  journalManuscriptsSchema,
};
