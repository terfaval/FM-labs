import {
  JOURNAL_PROJECTS,
  JOURNAL_STATUSES,
  JOURNAL_TYPES,
  type JournalEntry,
} from "./types";

type ValidationResult =
  | { valid: true; value: JournalEntry }
  | { valid: false; errors: Record<string, string> };

function hasValue(input: unknown): input is string {
  return typeof input === "string" && input.trim().length > 0;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateJournalEntryInput(input: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const value = (input ?? {}) as Record<string, unknown>;

  if (!hasValue(value.id)) errors.id = "Azonosito kotelezo.";
  if (!hasValue(value.date) || !ISO_DATE.test(value.date)) {
    errors.date = "Datum formatuma: YYYY-MM-DD.";
  }
  if (
    !JOURNAL_PROJECTS.includes(
      value.project as (typeof JOURNAL_PROJECTS)[number]
    )
  ) {
    errors.project = "Ervenytelen projekt.";
  }
  if (!JOURNAL_TYPES.includes(value.type as (typeof JOURNAL_TYPES)[number])) {
    errors.type = "Ervenytelen tipus.";
  }
  if (
    !JOURNAL_STATUSES.includes(
      value.status as (typeof JOURNAL_STATUSES)[number]
    )
  ) {
    errors.status = "Ervenytelen statusz.";
  }
  if (!hasValue(value.title)) errors.title = "Cim kotelezo.";
  if (!hasValue(value.summary)) errors.summary = "Summary kotelezo.";
  if (!hasValue(value.body)) errors.body = "Body kotelezo.";
  if (!hasValue(value.nextStep)) errors.nextStep = "Kovetkezo lepes kotelezo.";

  const steps = value.steps;
  if (!Array.isArray(steps) || steps.length === 0) {
    errors.steps = "Legalabb egy step kotelezo.";
  } else if (
    steps.some(
      (step) =>
        !step ||
        typeof step !== "object" ||
        !hasValue((step as Record<string, unknown>).label) ||
        !hasValue((step as Record<string, unknown>).text)
    )
  ) {
    errors.steps = "Minden stephez label es text kell.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    value: {
      id: value.id as string,
      date: value.date as string,
      project: value.project as JournalEntry["project"],
      type: value.type as JournalEntry["type"],
      status: value.status as JournalEntry["status"],
      title: (value.title as string).trim(),
      summary: (value.summary as string).trim(),
      body: (value.body as string).trim(),
      steps: steps as JournalEntry["steps"],
      nextStep: (value.nextStep as string).trim(),
      featured: Boolean(value.featured),
    },
  };
}

export function ensureUniqueId(entries: { id: string }[], id: string): boolean {
  return !entries.some((entry) => entry.id === id);
}
