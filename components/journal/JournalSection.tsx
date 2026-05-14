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

  const filteredEntries = useMemo(() => {
    return [...entries]
      .filter((entry) => entry.status === "published")
      .filter((entry) =>
        projectFilter === "all" ? true : entry.project === projectFilter
      )
      .filter((entry) => (typeFilter === "all" ? true : entry.type === typeFilter))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, projectFilter, typeFilter]);

  return (
    <SectionBlock title="Project Journal" id="project-journal">
      <div className="journal-filters">
        <label>
          Projekt
          <select
            value={projectFilter}
            onChange={(event) =>
              setProjectFilter(event.target.value as "all" | JournalProject)
            }
          >
            <option value="all">osszes</option>
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
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as "all" | JournalType)
            }
          >
            <option value="all">osszes</option>
            {JOURNAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="journal-list">
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
