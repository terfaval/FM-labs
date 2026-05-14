# Project Journal Home + Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a homepage `Project Journal` list (published entries only) and a hidden studio workflow (`/studio-login` + `/studio/journal`) that can create/edit/publish entries persisted to `content/journal/journal.json`.

**Architecture:** Keep journal persistence behind a small `JournalStore` interface so v1 uses file storage while keeping a clean replacement path for Vercel Blob later. Use route-level studio auth with a key-based login endpoint that sets a secure cookie session. Render journal entries in a dedicated homepage section with lightweight project/type filtering and expandable details.

**Tech Stack:** Next.js App Router (React 19), TypeScript, Vitest + Testing Library, Node `fs` for file storage.

---

## File Structure

- Create: `lib/journal/types.ts`  
  Purpose: canonical journal types, enums, constants.
- Create: `lib/journal/validation.ts`  
  Purpose: validate/parsing helpers for journal entries and payloads.
- Create: `lib/journal/validation.test.ts`  
  Purpose: unit tests for required fields, enums, date, IDs.
- Create: `lib/journal/store.ts`  
  Purpose: `JournalStore` interface + file-backed implementation.
- Create: `lib/journal/store.test.ts`  
  Purpose: read/write behavior, published-only filtering, sorting.
- Create: `lib/studio/session.ts`  
  Purpose: studio cookie/session helpers.
- Create: `lib/studio/session.test.ts`  
  Purpose: session utility behavior (token build/verify).
- Create: `app/api/studio/login/route.ts`  
  Purpose: verify key, set session cookie.
- Create: `app/api/studio/logout/route.ts`  
  Purpose: clear studio session cookie.
- Create: `app/api/journal/route.ts`  
  Purpose: public published entries endpoint.
- Create: `app/api/studio/journal/route.ts`  
  Purpose: protected list/create endpoint.
- Create: `app/api/studio/journal/[id]/route.ts`  
  Purpose: protected update endpoint.
- Create: `app/studio-login/page.tsx`  
  Purpose: studio key login screen.
- Create: `app/studio/journal/page.tsx`  
  Purpose: protected editor/list UI.
- Create: `components/journal/JournalSection.tsx`  
  Purpose: homepage journal list + filters + expand behavior.
- Create: `components/journal/JournalSection.test.tsx`  
  Purpose: expand/collapse and filter tests.
- Modify: `app/page.tsx`  
  Purpose: include journal section on homepage.
- Modify: `app/globals.css`  
  Purpose: minimal styles for homepage journal + studio pages.
- Modify: `content/journal/journal.json`  
  Purpose: seed valid schema root.

---

### Task 1: Journal types and validation

**Files:**
- Create: `lib/journal/types.ts`
- Create: `lib/journal/validation.ts`
- Test: `lib/journal/validation.test.ts`

- [ ] **Step 1: Write failing validation tests**

```ts
// lib/journal/validation.test.ts
import { describe, expect, it } from "vitest";
import { validateJournalEntryInput } from "./validation";

const base = {
  id: "entry-1",
  date: "2026-05-14",
  project: "portfolio",
  type: "planning",
  status: "draft",
  title: "Cim",
  summary: "Rovid osszegzes",
  body: "Hosszabb szoveg",
  steps: [{ label: "Start", text: "Elindult" }],
  nextStep: "Kovetkezo lepes",
  featured: false
} as const;

describe("validateJournalEntryInput", () => {
  it("accepts valid entry", () => {
    const result = validateJournalEntryInput(base);
    expect(result.valid).toBe(true);
  });

  it("rejects invalid project", () => {
    const result = validateJournalEntryInput({ ...base, project: "bad" });
    expect(result.valid).toBe(false);
    expect(result.errors.project).toBeDefined();
  });

  it("rejects invalid date format", () => {
    const result = validateJournalEntryInput({ ...base, date: "14-05-2026" });
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

Run: `npm test -- lib/journal/validation.test.ts`  
Expected: FAIL (`Cannot find module './validation'`).

- [ ] **Step 3: Implement types and validation**

```ts
// lib/journal/types.ts
export const JOURNAL_SCHEMA_VERSION = "v1" as const;

export const JOURNAL_PROJECTS = [
  "portfolio",
  "lumira",
  "szarnyfeszito",
  "mirachai",
  "novira",
  "kincstarto",
  "urbanecolab",
  "desk-research"
] as const;

export const JOURNAL_TYPES = [
  "planning",
  "feature",
  "visual",
  "refinement",
  "research",
  "decision"
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
```

```ts
// lib/journal/validation.ts
import {
  JOURNAL_PROJECTS,
  JOURNAL_STATUSES,
  JOURNAL_TYPES,
  type JournalEntry
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
  if (!JOURNAL_PROJECTS.includes(value.project as (typeof JOURNAL_PROJECTS)[number])) {
    errors.project = "Ervenytelen projekt.";
  }
  if (!JOURNAL_TYPES.includes(value.type as (typeof JOURNAL_TYPES)[number])) {
    errors.type = "Ervenytelen tipus.";
  }
  if (!JOURNAL_STATUSES.includes(value.status as (typeof JOURNAL_STATUSES)[number])) {
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
      featured: Boolean(value.featured)
    }
  };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- lib/journal/validation.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/journal/types.ts lib/journal/validation.ts lib/journal/validation.test.ts
git commit -m "feat: add journal types and entry validation"
```

---

### Task 2: File-backed JournalStore

**Files:**
- Create: `lib/journal/store.ts`
- Test: `lib/journal/store.test.ts`

- [ ] **Step 1: Write failing store tests**

```ts
// lib/journal/store.test.ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createFileJournalStore } from "./store";

describe("FileJournalStore", () => {
  it("returns only published entries in listPublished", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "journal-"));
    const filePath = path.join(dir, "journal.json");
    fs.writeFileSync(
      filePath,
      JSON.stringify({
        schemaVersion: "v1",
        entries: [
          { id: "a", date: "2026-05-14", project: "portfolio", type: "planning", status: "draft", title: "A", summary: "A", body: "A", steps: [{ label: "l", text: "t" }], nextStep: "n" },
          { id: "b", date: "2026-05-15", project: "portfolio", type: "feature", status: "published", title: "B", summary: "B", body: "B", steps: [{ label: "l", text: "t" }], nextStep: "n" }
        ]
      }),
      "utf8"
    );
    const store = createFileJournalStore(filePath);
    const entries = store.listPublished();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.id).toBe("b");
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

Run: `npm test -- lib/journal/store.test.ts`  
Expected: FAIL (`Cannot find module './store'`).

- [ ] **Step 3: Implement store interface and file store**

```ts
// lib/journal/store.ts
import fs from "node:fs";
import path from "node:path";
import { JOURNAL_SCHEMA_VERSION, type JournalDocument, type JournalEntry } from "./types";

export type JournalStore = {
  listAll: () => JournalEntry[];
  listPublished: () => JournalEntry[];
  getById: (id: string) => JournalEntry | null;
  upsert: (entry: JournalEntry) => JournalEntry;
};

function sortEntries(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

function readDocument(filePath: string): JournalDocument {
  if (!fs.existsSync(filePath)) {
    return { schemaVersion: JOURNAL_SCHEMA_VERSION, entries: [] };
  }
  const raw = fs.readFileSync(filePath, "utf8");
  if (!raw.trim()) {
    return { schemaVersion: JOURNAL_SCHEMA_VERSION, entries: [] };
  }
  return JSON.parse(raw) as JournalDocument;
}

function writeDocumentAtomic(filePath: string, doc: JournalDocument) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(doc, null, 2), "utf8");
  fs.renameSync(tempPath, filePath);
}

export function createFileJournalStore(filePath: string): JournalStore {
  return {
    listAll: () => sortEntries(readDocument(filePath).entries),
    listPublished: () =>
      sortEntries(readDocument(filePath).entries).filter((entry) => entry.status === "published"),
    getById: (id) => readDocument(filePath).entries.find((entry) => entry.id === id) ?? null,
    upsert: (entry) => {
      const doc = readDocument(filePath);
      const existingIndex = doc.entries.findIndex((current) => current.id === entry.id);
      if (existingIndex >= 0) {
        doc.entries[existingIndex] = entry;
      } else {
        doc.entries.push(entry);
      }
      doc.entries = sortEntries(doc.entries);
      writeDocumentAtomic(filePath, {
        schemaVersion: JOURNAL_SCHEMA_VERSION,
        entries: doc.entries
      });
      return entry;
    }
  };
}

export function createDefaultJournalStore(): JournalStore {
  return createFileJournalStore(path.join(process.cwd(), "content", "journal", "journal.json"));
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- lib/journal/store.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/journal/store.ts lib/journal/store.test.ts
git commit -m "feat: add file-backed journal store"
```

---

### Task 3: Studio session helpers and login/logout API

**Files:**
- Create: `lib/studio/session.ts`
- Create: `lib/studio/session.test.ts`
- Create: `app/api/studio/login/route.ts`
- Create: `app/api/studio/logout/route.ts`

- [ ] **Step 1: Write failing session tests**

```ts
// lib/studio/session.test.ts
import { describe, expect, it } from "vitest";
import { createStudioSessionToken, verifyStudioSessionToken } from "./session";

describe("studio session token", () => {
  it("verifies a token generated with same key", () => {
    const token = createStudioSessionToken("secret");
    expect(verifyStudioSessionToken(token, "secret")).toBe(true);
  });

  it("rejects token with different key", () => {
    const token = createStudioSessionToken("secret");
    expect(verifyStudioSessionToken(token, "other")).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

Run: `npm test -- lib/studio/session.test.ts`  
Expected: FAIL (`Cannot find module './session'`).

- [ ] **Step 3: Implement session utilities and login/logout routes**

```ts
// lib/studio/session.ts
import crypto from "node:crypto";

export const STUDIO_COOKIE_NAME = "studio_session";

function sign(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function createStudioSessionToken(key: string): string {
  return sign(key);
}

export function verifyStudioSessionToken(token: string | undefined, key: string): boolean {
  if (!token || !key) return false;
  return token === sign(key);
}
```

```ts
// app/api/studio/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createStudioSessionToken, STUDIO_COOKIE_NAME } from "@/lib/studio/session";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { key?: string };
  const expected = process.env.JOURNAL_STUDIO_KEY ?? "";
  if (!expected || !body.key || body.key !== expected) {
    return NextResponse.json({ ok: false, error: "Hibas kulcs." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE_NAME, createStudioSessionToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return response;
}
```

```ts
// app/api/studio/logout/route.ts
import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME } from "@/lib/studio/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- lib/studio/session.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/studio/session.ts lib/studio/session.test.ts app/api/studio/login/route.ts app/api/studio/logout/route.ts
git commit -m "feat: add studio session utilities and auth endpoints"
```

---

### Task 4: Journal API routes with studio protection

**Files:**
- Create: `app/api/journal/route.ts`
- Create: `app/api/studio/journal/route.ts`
- Create: `app/api/studio/journal/[id]/route.ts`
- Modify: `lib/journal/store.ts`
- Modify: `lib/journal/validation.ts`

- [ ] **Step 1: Add helper exports needed by routes**

```ts
// lib/journal/validation.ts
export function ensureUniqueId(entries: { id: string }[], id: string): boolean {
  return !entries.some((entry) => entry.id === id);
}
```

```ts
// lib/journal/store.ts
export function withDefaultStore<T>(fn: (store: JournalStore) => T): T {
  return fn(createDefaultJournalStore());
}
```

- [ ] **Step 2: Implement public journal route**

```ts
// app/api/journal/route.ts
import { NextResponse } from "next/server";
import { createDefaultJournalStore } from "@/lib/journal/store";

export async function GET() {
  const store = createDefaultJournalStore();
  return NextResponse.json({ entries: store.listPublished() });
}
```

- [ ] **Step 3: Implement protected studio journal routes**

```ts
// app/api/studio/journal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createDefaultJournalStore } from "@/lib/journal/store";
import { ensureUniqueId, validateJournalEntryInput } from "@/lib/journal/validation";
import { STUDIO_COOKIE_NAME, verifyStudioSessionToken } from "@/lib/studio/session";

async function isAuthorized(): Promise<boolean> {
  const expected = process.env.JOURNAL_STUDIO_KEY ?? "";
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDIO_COOKIE_NAME)?.value;
  return verifyStudioSessionToken(token, expected);
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = createDefaultJournalStore();
  return NextResponse.json({ entries: store.listAll() });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const validated = validateJournalEntryInput(body);
  if (!validated.valid) {
    return NextResponse.json({ errors: validated.errors }, { status: 400 });
  }
  const store = createDefaultJournalStore();
  if (!ensureUniqueId(store.listAll(), validated.value.id)) {
    return NextResponse.json({ errors: { id: "Az ID mar foglalt." } }, { status: 400 });
  }
  const saved = store.upsert(validated.value);
  return NextResponse.json({ entry: saved });
}
```

```ts
// app/api/studio/journal/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createDefaultJournalStore } from "@/lib/journal/store";
import { validateJournalEntryInput } from "@/lib/journal/validation";
import { STUDIO_COOKIE_NAME, verifyStudioSessionToken } from "@/lib/studio/session";

async function isAuthorized(): Promise<boolean> {
  const expected = process.env.JOURNAL_STUDIO_KEY ?? "";
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDIO_COOKIE_NAME)?.value;
  return verifyStudioSessionToken(token, expected);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const validated = validateJournalEntryInput({ ...body, id });
  if (!validated.valid) {
    return NextResponse.json({ errors: validated.errors }, { status: 400 });
  }
  const store = createDefaultJournalStore();
  if (!store.getById(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const saved = store.upsert(validated.value);
  return NextResponse.json({ entry: saved });
}
```

- [ ] **Step 4: Run focused tests**

Run: `npm test -- lib/journal/validation.test.ts lib/journal/store.test.ts lib/studio/session.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/journal/route.ts app/api/studio/journal/route.ts app/api/studio/journal/[id]/route.ts lib/journal/store.ts lib/journal/validation.ts
git commit -m "feat: add public and studio journal api routes"
```

---

### Task 5: Build `/studio-login` and `/studio/journal` pages

**Files:**
- Create: `app/studio-login/page.tsx`
- Create: `app/studio/journal/page.tsx`

- [ ] **Step 1: Implement login page**

```tsx
// app/studio-login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    });
    if (!response.ok) {
      setError("Hibas kulcs.");
      return;
    }
    router.push("/studio/journal");
  }

  return (
    <main className="studio-login">
      <form onSubmit={onSubmit} className="studio-login__form">
        <h1>Studio Login</h1>
        <label htmlFor="studio-key">Kulcs</label>
        <input id="studio-key" type="password" value={key} onChange={(event) => setKey(event.target.value)} />
        {error ? <p className="studio-login__error">{error}</p> : null}
        <button type="submit">Belépés</button>
      </form>
    </main>
  );
}
```

- [ ] **Step 2: Implement studio page with entry list + editor**

```tsx
// app/studio/journal/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { JOURNAL_PROJECTS, JOURNAL_TYPES, type JournalEntry } from "@/lib/journal/types";

function emptyEntry(): JournalEntry {
  return {
    id: "",
    date: "",
    project: "portfolio",
    type: "planning",
    status: "draft",
    title: "",
    summary: "",
    body: "",
    steps: [{ label: "", text: "" }],
    nextStep: "",
    featured: false
  };
}

export default function StudioJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [form, setForm] = useState<JournalEntry>(emptyEntry());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [jsonDraft, setJsonDraft] = useState("");
  const [error, setError] = useState("");

  async function loadEntries() {
    const response = await fetch("/api/studio/journal");
    if (response.status === 401) {
      window.location.href = "/studio-login";
      return;
    }
    const data = await response.json();
    setEntries(data.entries ?? []);
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  function parseDraft() {
    setError("");
    try {
      const parsed = JSON.parse(jsonDraft) as JournalEntry;
      setForm({ ...emptyEntry(), ...parsed });
      setEditingId(parsed.id ?? null);
    } catch {
      setError("Ervenytelen JSON.");
    }
  }

  async function save(status: "draft" | "published") {
    const payload = { ...form, status };
    const isEdit = Boolean(editingId);
    const endpoint = isEdit ? `/api/studio/journal/${editingId}` : "/api/studio/journal";
    const method = isEdit ? "PUT" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Mentési hiba.");
      return;
    }
    setForm(emptyEntry());
    setEditingId(null);
    setJsonDraft("");
    setError("");
    await loadEntries();
  }

  const orderedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  );

  return (
    <main className="studio-journal">
      <h1>Project Journal Studio</h1>
      <section className="studio-journal__list">
        {orderedEntries.map((entry) => (
          <button key={entry.id} type="button" onClick={() => { setForm(entry); setEditingId(entry.id); }}>
            {entry.date} · {entry.project} · {entry.type} · {entry.status} · {entry.title}
          </button>
        ))}
      </section>
      <section className="studio-journal__editor">
        <h2>{editingId ? "Bejegyzés szerkesztése" : "Új bejegyzés"}</h2>
        <textarea value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} placeholder="JSON draft" />
        <button type="button" onClick={parseDraft}>JSON parse</button>
        {error ? <p className="studio-journal__error">{error}</p> : null}
        <input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} placeholder="id" />
        <input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} placeholder="YYYY-MM-DD" />
        <select value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value as JournalEntry["project"] })}>
          {JOURNAL_PROJECTS.map((project) => <option key={project} value={project}>{project}</option>)}
        </select>
        <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as JournalEntry["type"] })}>
          {JOURNAL_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="title" />
        <textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} placeholder="summary" />
        <textarea value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="body" />
        <input value={form.nextStep} onChange={(event) => setForm({ ...form, nextStep: event.target.value })} placeholder="next step" />
        <button type="button" onClick={() => void save("draft")}>Save Draft</button>
        <button type="button" onClick={() => void save("published")}>Publish</button>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Run type/test smoke check**

Run: `npm test -- lib/journal/validation.test.ts lib/journal/store.test.ts lib/studio/session.test.ts`  
Expected: PASS.

- [ ] **Step 4: Manual behavior check**

Run: `npm run dev`  
Expected:
- `/studio-login` loads,
- valid key redirects to `/studio/journal`,
- studio page lists entries and can submit draft/published.

- [ ] **Step 5: Commit**

```bash
git add app/studio-login/page.tsx app/studio/journal/page.tsx
git commit -m "feat: add studio login and journal editor pages"
```

---

### Task 6: Homepage Project Journal section + tests

**Files:**
- Create: `components/journal/JournalSection.tsx`
- Create: `components/journal/JournalSection.test.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write failing component tests**

```tsx
// components/journal/JournalSection.test.tsx
import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { JournalSection } from "./JournalSection";

const entries = [
  {
    id: "a",
    date: "2026-05-14",
    project: "portfolio",
    type: "planning",
    status: "published",
    title: "A",
    summary: "Summary A",
    body: "Body A",
    steps: [{ label: "L1", text: "T1" }],
    nextStep: "Next A"
  },
  {
    id: "b",
    date: "2026-05-13",
    project: "lumira",
    type: "feature",
    status: "published",
    title: "B",
    summary: "Summary B",
    body: "Body B",
    steps: [{ label: "L1", text: "T1" }],
    nextStep: "Next B"
  }
] as const;

describe("JournalSection", () => {
  it("expands entry body on click", () => {
    render(<JournalSection entries={entries as never} />);
    expect(screen.queryByText("Body A")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /A/i }));
    expect(screen.getByText("Body A")).toBeInTheDocument();
  });

  it("filters by project", () => {
    render(<JournalSection entries={entries as never} />);
    fireEvent.change(screen.getByLabelText("Projekt"), { target: { value: "lumira" } });
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("A")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

Run: `npm test -- components/journal/JournalSection.test.tsx`  
Expected: FAIL (`Cannot find module './JournalSection'`).

- [ ] **Step 3: Implement JournalSection component and home integration**

```tsx
// components/journal/JournalSection.tsx
"use client";

import { useMemo, useState } from "react";
import { JOURNAL_PROJECTS, JOURNAL_TYPES, type JournalEntry } from "@/lib/journal/types";
import { SectionBlock } from "@/components/SectionBlock";

type Props = {
  entries: JournalEntry[];
};

export function JournalSection({ entries }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const visible = useMemo(() => {
    return entries
      .filter((entry) => entry.status === "published")
      .filter((entry) => (projectFilter === "all" ? true : entry.project === projectFilter))
      .filter((entry) => (typeFilter === "all" ? true : entry.type === typeFilter))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, projectFilter, typeFilter]);

  return (
    <SectionBlock title="Project Journal" id="project-journal">
      <div className="journal-filters">
        <label>
          Projekt
          <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
            <option value="all">osszes</option>
            {JOURNAL_PROJECTS.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </label>
        <label>
          Tipus
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">osszes</option>
            {JOURNAL_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <ul className="journal-list">
        {visible.map((entry) => {
          const expanded = expandedId === entry.id;
          return (
            <li key={entry.id} className="journal-item">
              <button
                type="button"
                className="journal-item__head"
                onClick={() => setExpandedId(expanded ? null : entry.id)}
              >
                <span>{entry.date}</span>
                <span className="journal-tag">{entry.project}</span>
                <span className="journal-tag">{entry.type}</span>
                <strong>{entry.title}</strong>
              </button>
              {expanded ? (
                <div className="journal-item__body">
                  <p>{entry.summary}</p>
                  <p>{entry.body}</p>
                  <ul>
                    {entry.steps.map((step, index) => (
                      <li key={`${entry.id}-step-${index}`}>
                        <strong>{step.label}</strong>
                        <p>{step.text}</p>
                      </li>
                    ))}
                  </ul>
                  <p><strong>Kovetkezo:</strong> {entry.nextStep}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SectionBlock>
  );
}
```

```tsx
// app/page.tsx (added parts only)
import { createDefaultJournalStore } from "@/lib/journal/store";
import { JournalSection } from "@/components/journal/JournalSection";

// inside HomePage()
const journalEntries = createDefaultJournalStore().listPublished();

// inside return, before collaboration block
<JournalSection entries={journalEntries} />
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- components/journal/JournalSection.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/journal/JournalSection.tsx components/journal/JournalSection.test.tsx app/page.tsx
git commit -m "feat: add homepage project journal section"
```

---

### Task 7: Styling and seed data

**Files:**
- Modify: `app/globals.css`
- Modify: `content/journal/journal.json`

- [ ] **Step 1: Add journal + studio styles**

```css
/* app/globals.css (append) */
.journal-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.journal-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.journal-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
}

.journal-item__head {
  width: 100%;
  border: 0;
  background: transparent;
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: left;
  padding: 12px;
  cursor: pointer;
}

.journal-tag {
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
}

.journal-item__body {
  padding: 0 12px 12px;
}

.studio-login,
.studio-journal {
  max-width: 980px;
  margin: 0 auto;
  padding: 32px 20px;
}

.studio-login__form,
.studio-journal__editor {
  display: grid;
  gap: 10px;
}
```

- [ ] **Step 2: Seed JSON root**

```json
{
  "schemaVersion": "v1",
  "entries": []
}
```

- [ ] **Step 3: Run full test suite**

Run: `npm test`  
Expected: PASS.

- [ ] **Step 4: Build check**

Run: `npm run build`  
Expected: successful Next.js production build.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css content/journal/journal.json
git commit -m "style: add journal and studio base styles with seeded json"
```

---

### Task 8: End-to-end verification and handoff notes

**Files:**
- Modify: `README.md` (only if project docs require env mention)

- [ ] **Step 1: Add env variable note if missing**

```md
### Studio Journal

Set `JOURNAL_STUDIO_KEY` in `.env.local` to enable `/studio-login` and `/studio/journal`.
```

- [ ] **Step 2: Run targeted manual checks**

Run:
- `npm run dev`
- Open `/studio-login`, submit invalid key, confirm error
- Submit valid key, confirm redirect to `/studio/journal`
- Create one draft and one published entry
- Open `/`, confirm only published appears in `Project Journal`

Expected: all checks pass.

- [ ] **Step 3: Capture verification output summary in final PR/notes**

```txt
Verified: validation tests, store tests, session tests, journal component tests, full test suite, production build, manual studio/home behavior.
```

- [ ] **Step 4: Final commit**

```bash
git add README.md
git commit -m "docs: document studio journal env setup"
```

---

## Self-Review

### 1) Spec coverage

- Homepage-only journal list (no `/journal` route): covered by Task 6.
- Tags + date + title + expand details: covered by Task 6.
- Fixed `project` and `type` enums: covered by Task 1.
- `draft/published` behavior and published-only public visibility: covered by Tasks 1, 2, 4, 6.
- Hidden studio workflow with `/studio-login` and `/studio/journal`: covered by Tasks 3 and 5.
- Direct write to `content/journal/journal.json`: covered by Tasks 2 and 7.
- Easy future Blob switch: covered by Task 2 (`JournalStore` interface).

No coverage gaps found.

### 2) Placeholder scan

- No `TBD`, `TODO`, or deferred implementation placeholders.
- Every code step includes concrete code block.
- Every verification step includes concrete command and expected result.

### 3) Type consistency

- Entry fields are consistent across types, validation, store, APIs, and UI.
- Enums are defined once in `lib/journal/types.ts` and reused.
- `status` semantics (`draft | published`) stay consistent across endpoints/UI.

No naming/signature inconsistencies found.
