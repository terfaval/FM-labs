export const JOURNAL_SCHEMA_VERSION = "v1" as const;

export const JOURNAL_PROJECTS = [
  "portfolio",
  "lumira",
  "szarnyfeszito",
  "mirachai",
  "novira",
  "kincstarto",
  "urbanecolab",
  "desk-research",
] as const;

export const JOURNAL_TYPES = [
  "planning",
  "feature",
  "visual",
  "refinement",
  "research",
  "decision",
] as const;

export const JOURNAL_STATUSES = ["draft", "published"] as const;

export type JournalProject = (typeof JOURNAL_PROJECTS)[number];
export type JournalType = (typeof JOURNAL_TYPES)[number];
export type JournalStatus = (typeof JOURNAL_STATUSES)[number];

export type JournalStep = {
  label: string;
  text: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  project: JournalProject;
  type: JournalType;
  status: JournalStatus;
  title: string;
  summary: string;
  body: string;
  steps: JournalStep[];
  nextStep: string;
  featured?: boolean;
};

export type JournalDocument = {
  schemaVersion: typeof JOURNAL_SCHEMA_VERSION;
  entries: JournalEntry[];
};
