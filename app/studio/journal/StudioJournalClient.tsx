"use client";

import { useEffect, useMemo, useState } from "react";
import {
  JOURNAL_PROJECTS,
  JOURNAL_TYPES,
  type JournalEntry,
  type JournalProject,
  type JournalStatus,
  type JournalType,
} from "@/lib/journal/types";
import { shouldUsePutForSave } from "@/lib/journal/saveMode";
import { mergeJournalEntries } from "@/lib/journal/entryList";

type EntryForm = JournalEntry;

function createEmptyEntry(): EntryForm {
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
    featured: false,
  };
}

function toFormEntry(input: Partial<JournalEntry>): EntryForm {
  const base = createEmptyEntry();
  return {
    ...base,
    ...input,
    steps:
      Array.isArray(input.steps) && input.steps.length > 0
        ? input.steps
        : base.steps,
  };
}

const JOURNAL_PROMPT_TEMPLATE = `Feladat:
Az alábbi fejlesztési beszélgetés alapján keszits egyetlen publikus naplo-bejegyzes draftot.

Fontos:
- magyar, termeszetes, emberi hang
- nem marketinges, nem commit-log stilus
- konkretumok: mi valtozott, miert, mi lett jobb, mi maradt nyitva, mi a kovetkezo lepes
- csak egy bejegyzest adj vissza
- a valaszt CSAK nyers JSON objektumkent add vissza (ne markdown, ne magyarazat)

Kotelezo schema:
{
  "id": "kebab-case-azonosito",
  "date": "YYYY-MM-DD",
  "project": "portfolio | lumira | szarnyfeszito | mirachai | novira | kincstarto | urbanecolab | desk-research",
  "type": "planning | feature | visual | refinement | research | decision",
  "status": "draft",
  "title": "rovid cim",
  "summary": "1-2 mondat",
  "body": "3-6 mondat",
  "steps": [
    { "label": "rovid cim", "text": "1-2 mondat" }
  ],
  "nextStep": "1 mondat",
  "featured": false
}

Tovabbi szabalyok:
- steps: 2-5 elem
- project es type csak a fent megadott ertek lehet
- date legyen ISO formatum (YYYY-MM-DD)
- status maradjon "draft"

Forras-beszelgetes:
[IDE ILLESZD BE A TELJES BESZELGETEST VAGY OSSZEFOGLALOT]`;

export function StudioJournalClient() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [form, setForm] = useState<EntryForm>(createEmptyEntry());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftJson, setDraftJson] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"" | "ok" | "error">("");

  async function loadEntries(options?: { preserveExisting?: boolean }) {
    const response = await fetch("/api/studio/journal", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error ?? "Nem sikerult a lista betoltese.");
      return;
    }
    const next = Array.isArray(payload.entries) ? payload.entries : [];
    setEntries((prev) =>
      options?.preserveExisting ? mergeJournalEntries(next, prev) : next
    );
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  function selectForEdit(entry: JournalEntry) {
    setEditingId(entry.id);
    setForm(toFormEntry(entry));
    setError("");
  }

  function startNew() {
    setEditingId(null);
    setForm(createEmptyEntry());
    setDraftJson("");
    setError("");
  }

  function parseDraft() {
    try {
      const parsed = JSON.parse(draftJson) as Partial<JournalEntry>;
      setForm(toFormEntry(parsed));
      const parsedId = typeof parsed.id === "string" ? parsed.id : null;
      setEditingId(shouldUsePutForSave(parsedId, entries) ? parsedId : null);
      setError("");
    } catch {
      setError("Ervenytelen JSON.");
    }
  }

  async function save(status: JournalStatus) {
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, status };
      const isEdit = shouldUsePutForSave(editingId, entries);
      const endpoint = isEdit
        ? `/api/studio/journal/${editingId}`
        : "/api/studio/journal";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data?.errors && typeof data.errors === "object") {
          setError(Object.values(data.errors).join(" "));
        } else {
          setError(data?.error ?? "Mentesi hiba.");
        }
        return;
      }
      if (data?.entry && typeof data.entry === "object") {
        setEntries((prev) => mergeJournalEntries([data.entry as JournalEntry], prev));
      }
      startNew();
      await loadEntries({ preserveExisting: true });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    window.location.href = "/studio-login";
  }

  async function copyPromptTemplate() {
    try {
      await navigator.clipboard.writeText(JOURNAL_PROMPT_TEMPLATE);
      setCopyStatus("ok");
    } catch {
      setCopyStatus("error");
    }
  }

  const orderedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  );

  return (
    <main className="studio-journal">
      <div className="studio-journal__header">
        <h1>Project Journal Studio</h1>
        <button type="button" onClick={() => void logout()}>
          Kilepes
        </button>
      </div>

      <section className="studio-journal__list">
        <div className="studio-journal__prompt-box">
          <div className="studio-journal__prompt-head">
            <h2>Prompt sablon uj bejegyzeshez</h2>
            <button type="button" onClick={() => void copyPromptTemplate()}>
              Masolas
            </button>
          </div>
          <p>
            Ezt a promptot barmelyik Codex agentnek odaadhatod: a beszelgetes
            alapjan keszit egy JSON draftot, amit csak visszateszel ide.
          </p>
          <textarea
            readOnly
            value={JOURNAL_PROMPT_TEMPLATE}
            rows={16}
            className="studio-journal__prompt-text"
          />
          {copyStatus === "ok" ? (
            <p className="studio-journal__prompt-status">Prompt kimasolva.</p>
          ) : null}
          {copyStatus === "error" ? (
            <p className="studio-journal__error">
              A masolas nem sikerult, jelold ki es masold kezzel.
            </p>
          ) : null}
        </div>

        <div className="studio-journal__list-header">
          <h2>Korabbi bejegyzesek</h2>
          <button type="button" onClick={startNew}>
            Uj bejegyzes
          </button>
        </div>
        {orderedEntries.length === 0 ? (
          <p>Meg nincs bejegyzes.</p>
        ) : (
          <ul>
            {orderedEntries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => selectForEdit(entry)}
                  className="studio-journal__entry-button"
                >
                  <span>{entry.date}</span>
                  <span>{entry.project}</span>
                  <span>{entry.type}</span>
                  <span>{entry.status}</span>
                  <strong>{entry.title}</strong>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="studio-journal__editor">
        <h2>{editingId ? "Bejegyzes szerkesztese" : "Uj bejegyzes"}</h2>

        <label htmlFor="journal-draft-json">JSON draft beillesztese</label>
        <textarea
          id="journal-draft-json"
          value={draftJson}
          onChange={(event) => setDraftJson(event.target.value)}
          rows={7}
          placeholder='{"id":"..."}'
        />
        <button type="button" onClick={parseDraft}>
          JSON parse
        </button>

        {error ? <p className="studio-journal__error">{error}</p> : null}

        <label>
          ID
          <input
            value={form.id}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, id: event.target.value }))
            }
          />
        </label>
        <label>
          Datum
          <input
            value={form.date}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, date: event.target.value }))
            }
            placeholder="YYYY-MM-DD"
          />
        </label>
        <label>
          Projekt
          <select
            value={form.project}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                project: event.target.value as JournalProject,
              }))
            }
          >
            {JOURNAL_PROJECTS.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipus
          <select
            value={form.type}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                type: event.target.value as JournalType,
              }))
            }
          >
            {JOURNAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cim
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
          />
        </label>
        <label>
          Summary
          <textarea
            value={form.summary}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, summary: event.target.value }))
            }
            rows={3}
          />
        </label>
        <label>
          Body
          <textarea
            value={form.body}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, body: event.target.value }))
            }
            rows={6}
          />
        </label>

        <fieldset>
          <legend>Steps</legend>
          {form.steps.map((step, index) => (
            <div key={`${index}-${step.label}`} className="studio-journal__step-row">
              <input
                value={step.label}
                placeholder="label"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    steps: prev.steps.map((current, currentIndex) =>
                      currentIndex === index
                        ? { ...current, label: event.target.value }
                        : current
                    ),
                  }))
                }
              />
              <input
                value={step.text}
                placeholder="text"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    steps: prev.steps.map((current, currentIndex) =>
                      currentIndex === index
                        ? { ...current, text: event.target.value }
                        : current
                    ),
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    steps:
                      prev.steps.length > 1
                        ? prev.steps.filter((_, currentIndex) => currentIndex !== index)
                        : prev.steps,
                  }))
                }
              >
                Torles
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                steps: [...prev.steps, { label: "", text: "" }],
              }))
            }
          >
            Step hozzaadas
          </button>
        </fieldset>

        <label>
          Kovetkezo lepes
          <input
            value={form.nextStep}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, nextStep: event.target.value }))
            }
          />
        </label>
        <label className="studio-journal__checkbox">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, featured: event.target.checked }))
            }
          />
          Featured
        </label>

        <div className="studio-journal__actions">
          <button type="button" onClick={() => void save("draft")} disabled={loading}>
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => void save("published")}
            disabled={loading}
          >
            Publish
          </button>
        </div>
      </section>
    </main>
  );
}
