interface JournalStats {
  readonly journalFullName: string;
  readonly avgDaysToFirstDecision: number | null;
  readonly stdDaysToFirstDecision: number | null;
  readonly distinctManuscripts: number;
  readonly pctReceivedRevisionOnInitialSub: number | null;
  readonly pctAcceptedAfterRevision: number | null;
  readonly impactFactor: string | null;
  readonly academicField: string | null;
}

export type { JournalStats };
