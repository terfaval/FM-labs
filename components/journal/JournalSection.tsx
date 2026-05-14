"use client";

import { useMemo, useState } from "react";
import { SectionBlock } from "@/components/SectionBlock";
import {
  JOURNAL_PROJECTS,
  JOURNAL_TYPES,
  type JournalEntry,
  type JournalProject,
  type JournalType,
} from "@/lib/journal/types";

type JournalSectionProps = {
  entries: JournalEntry[];
};

export function JournalSection({ entries }: JournalSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<"all" | JournalProject>(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<"all" | JournalType>("all");

  const publishedEntries = useMemo(
    () => entries.filter((entry) => entry.status === "published"),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    return [...publishedEntries]
      .filter((entry) =>
        projectFilter === "all" ? true : entry.project === projectFilter
      )
      .filter((entry) => (typeFilter === "all" ? true : entry.type === typeFilter))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [publishedEntries, projectFilter, typeFilter]);

  if (publishedEntries.length === 0) {
    return null;
  }

  return (
    <SectionBlock title="Fejlesztesi naplo" id="project-journal">
      <div className="journal-intro">
        <p>
          Itt roviden osszegzem, min dolgozom eppen, es merre mozdulnak a
          projektek.
        </p>
        <p>
          Nem keszre csiszolt beszamolok ezek, inkabb pillanatkepek: dontesek,
          iranyvaltasok, aprankenti elorelepesek.
        </p>
        <p>
          Ha egy konkret szal erdekel, a projekt- es tipuscimkekkel gyorsan
          ratalalsz.
        </p>
      </div>

      <div className="journal-filters journal-filters--panel">
        <div className="journal-filter">
          <label htmlFor="journal-project-filter">Projekt</label>
          <select
            id="journal-project-filter"
            value={projectFilter}
            onChange={(event) =>
              setProjectFilter(event.target.value as "all" | JournalProject)
            }
          >
            <option value="all">Minden projekt</option>
            {JOURNAL_PROJECTS.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        <div className="journal-filter">
          <label htmlFor="journal-type-filter">Tipus</label>
          <select
            id="journal-type-filter"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as "all" | JournalType)
            }
          >
            <option value="all">Minden tipus</option>
            {JOURNAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="journal-list">
        {filteredEntries.length === 0 ? (
          <li className="journal-item">
            <div className="journal-item__body">
              <p>Nincs talalat erre a szuro-kombinaciora.</p>
            </div>
          </li>
        ) : null}
        {filteredEntries.map((entry) => {
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
                      <li key={`${entry.id}-${index}`}>
                        <strong>{step.label}</strong>
                        <p>{step.text}</p>
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Kovetkezo:</strong> {entry.nextStep}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SectionBlock>
  );
}
