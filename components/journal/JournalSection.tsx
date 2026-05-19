"use client";

import type { CSSProperties } from "react";
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

const projectLabels: Record<JournalProject, string> = {
  portfolio: "Portfólió",
  lumira: "Lumira",
  szarnyfeszito: "Szárnyfeszítő",
  mirachai: "Mirachai",
  novira: "Novira",
  kincstarto: "Kincstartó",
  urbanecolab: "Urban EcoLab",
  "desk-research": "Desk Research",
};

const projectPillColors: Record<JournalProject, string> = {
  portfolio: "#2A9DAF",
  lumira: "#3A78D6",
  szarnyfeszito: "#BE2D12",
  mirachai: "#AF6A2A",
  novira: "#5A5BD6",
  kincstarto: "#2F9A67",
  urbanecolab: "#2F6F5E",
  "desk-research": "#6A6A74",
};

const typeLabels: Record<JournalType, string> = {
  planning: "Tervezés",
  feature: "Fejlesztés",
  visual: "Vizuál",
  refinement: "Finomítás",
  research: "Kutatás",
  decision: "Döntés",
};

const typePillColors: Record<JournalType, string> = {
  planning: "#2F6F5E",
  feature: "#2A9DAF",
  visual: "#824FB5",
  refinement: "#D96A43",
  research: "#3A78D6",
  decision: "#B34D8A",
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
    <SectionBlock title="Fejlesztési napló" id="project-journal">
      <div className="journal-intro">
        <p>
          Itt röviden összegzem, min dolgozom éppen, merre mozdulnak a projektek, és milyen döntések,
          irányváltások vagy apró, de fontos előrelépések történnek közben; ha egy konkrét szál érdekel,
          a projekt- és típuscímkékkel gyorsan rátalálsz.
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
          <label htmlFor="journal-type-filter">Típus</label>
          <select
            id="journal-type-filter"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as "all" | JournalType)
            }
          >
            <option value="all">Minden típus</option>
            {JOURNAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="journal-list">
        {filteredEntries.length === 0 ? (
          <li className="journal-item">
            <div className="journal-item__body">
              <p>Nincs találat erre a szűrőkombinációra.</p>
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
                aria-expanded={expanded}
              >
                <span className="journal-item__meta">
                  <span className="journal-item__date">{entry.date}</span>
                  <span
                    className="journal-tag journal-tag--project"
                    style={
                      { "--journal-tag-color": projectPillColors[entry.project] } as CSSProperties
                    }
                  >
                    {projectLabels[entry.project]}
                  </span>
                  <span
                    className="journal-tag journal-tag--type"
                    style={
                      { "--journal-tag-color": typePillColors[entry.type] } as CSSProperties
                    }
                  >
                    {typeLabels[entry.type]}
                  </span>
                </span>
                <strong className="journal-item__title">{entry.title}</strong>
                {!expanded ? <p className="journal-item__summary">{entry.summary}</p> : null}
              </button>
              {expanded ? (
                <div className="journal-item__body">
                  <p>{entry.body}</p>
                  <ul className="journal-steps">
                    {entry.steps.map((step, index) => (
                      <li key={`${entry.id}-${index}`} className="journal-step">
                        <span className="journal-step__index">{index + 1}</span>
                        <div className="journal-step__content">
                          <strong className="journal-step__label">{step.label}</strong>
                          <p>{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="journal-item__next-step">
                    <strong>Következő:</strong> {entry.nextStep}
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
