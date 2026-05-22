import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Database,
  SearchCheck,
  FileSpreadsheet,
  FolderTree,
  FileSearch,
  Compass,
  ListChecks,
  ShieldCheck,
  UserCheck,
  ArrowUpRight,
  X,
} from "lucide-react";
import type { DeskResearchModalModel } from "@/lib/content/deskResearchModalModel";
import {
  deskResearchSampleOutput,
  type DeskResearchSampleTableRow,
} from "@/lib/content/deskResearchSampleOutput";
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";
const PREVIEW_PAGE_SIZE = 100;

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users />,
  Database: <Database />,
  SearchCheck: <SearchCheck />,
  FileSpreadsheet: <FileSpreadsheet />,
  FolderTree: <FolderTree />,
  FileSearch: <FileSearch />,
};

function getWorkflowIcon(title: string) {
  const key = title.toLowerCase();
  if (key.includes("discover")) return <Compass />;
  if (key.includes("enrich")) return <Database />;
  if (key.includes("valid")) return <ShieldCheck />;
  if (key.includes("review")) return <UserCheck />;
  if (key.includes("export") || key.includes("deliver")) return <ListChecks />;
  return <ListChecks />;
}

function renderStructuredText(text: string) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const bullets = lines.filter((line) => line.startsWith("- "));
    const plain = lines.filter((line) => !line.startsWith("- "));
    return (
      <React.Fragment key={`${index}-${block}`}>
        {plain.length > 0 ? <p>{plain.join(" ")}</p> : null}
        {bullets.length > 0 ? <p className="deskresearch-modal__inline-list">{bullets.map((l) => l.replace(/^-+\s*/, "")).join(" / ")}</p> : null}
      </React.Fragment>
    );
  });
}

function getShortText(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  const [firstSentence] = compact.split(/(?<=[.!?])\s+/);
  if (!firstSentence) return compact;
  return firstSentence.length > 140 ? `${firstSentence.slice(0, 139).trimEnd()}...` : firstSentence;
}

function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderScoreBadge(score: number | null) {
  if (typeof score !== "number") {
    return <span className="deskresearch-sample__score deskresearch-sample__score--empty">n/a</span>;
  }
  return <span className="deskresearch-sample__score">{score}</span>;
}

function buildDistribution(entries: string[]) {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    const key = entry.trim() || "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function uniqueCount(entries: Array<string | undefined>) {
  return new Set(
    entries
      .map((entry) => (entry ?? "").trim().toLowerCase())
      .filter(Boolean)
  ).size;
}

function fitStats(rows: DeskResearchSampleTableRow[]) {
  const scores = rows
    .map((row) => row.fitScore)
    .filter((score): score is number => typeof score === "number");
  if (scores.length === 0) {
    return null;
  }
  const total = scores.reduce((acc, score) => acc + score, 0);
  return {
    avg: (total / scores.length).toFixed(1),
    min: Math.min(...scores),
    max: Math.max(...scores),
  };
}

export function DeskResearchModalNarrative({ model }: { model: DeskResearchModalModel }) {
  const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
  const [b1, b2, b3, b4, b5, b6, b7, b8, b9] = model.blocks;
  const quantityRows = deskResearchSampleOutput.pipelines.quantity.rows;
  const qualityRows = deskResearchSampleOutput.pipelines.quality.rows;
  const [previewModal, setPreviewModal] = useState<"quantity" | "quality" | null>(null);
  const [previewQuery, setPreviewQuery] = useState("");
  const [previewPage, setPreviewPage] = useState(1);
  const [fullRows, setFullRows] = useState<{
    quantity?: DeskResearchSampleTableRow[];
    quality?: DeskResearchSampleTableRow[];
  }>({});
  const [fullRowsLoading, setFullRowsLoading] = useState<{
    quantity: boolean;
    quality: boolean;
  }>({
    quantity: false,
    quality: false,
  });
  const [fullRowsError, setFullRowsError] = useState<{
    quantity?: string;
    quality?: string;
  }>({});
  const previewType = previewModal ?? "quantity";
  const contactIntro = model.contact.intro;

  const loadFullRows = (pipeline: "quantity" | "quality") => {
    if (fullRows[pipeline] || fullRowsLoading[pipeline]) {
      return;
    }

    const source =
      pipeline === "quantity"
        ? "/deskresearch/sample/quantity_full_preview.json"
        : "/deskresearch/sample/quality_full_preview.json";

    let cancelled = false;
    setFullRowsLoading((prev) => ({ ...prev, [pipeline]: true }));
    setFullRowsError((prev) => ({ ...prev, [pipeline]: undefined }));

    fetch(source)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`fetch_failed_${response.status}`);
        }
        return response.json();
      })
      .then((rows: DeskResearchSampleTableRow[]) => {
        if (cancelled) return;
        setFullRows((prev) => ({ ...prev, [pipeline]: rows }));
      })
      .catch(() => {
        if (cancelled) return;
        setFullRowsError((prev) => ({
          ...prev,
          [pipeline]: "A teljes preview most nem tölthető be.",
        }));
      })
      .finally(() => {
        if (cancelled) return;
        setFullRowsLoading((prev) => ({ ...prev, [pipeline]: false }));
      });

    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    if (!previewModal) return;
    loadFullRows(previewModal);
  }, [previewModal, fullRows, fullRowsLoading]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadFullRows("quantity");
      loadFullRows("quality");
    }, 250);
    return () => window.clearTimeout(timer);
  }, [fullRows, fullRowsLoading]);

  const quantitySource = fullRows.quantity ?? quantityRows;
  const qualitySource = fullRows.quality ?? qualityRows;

  const quantityStats = useMemo(() => {
    const topCategories = buildDistribution(
      quantitySource.map((row) => row.category ?? "unknown")
    ).slice(0, 5);
    const fit = fitStats(quantitySource);
    const exportReady = quantitySource.filter(
      (row) => (row.quantityStatus ?? "").toLowerCase() === "export_ready"
    ).length;
    return {
      records: quantitySource.length,
      cities: uniqueCount(quantitySource.map((row) => row.city)),
      categories: uniqueCount(quantitySource.map((row) => row.category)),
      fit,
      exportReady,
      topCategories,
    };
  }, [quantitySource]);

  const qualityStats = useMemo(() => {
    const topTypes = buildDistribution(qualitySource.map((row) => row.type ?? "unknown")).slice(0, 5);
    const fit = fitStats(qualitySource);
    const withEvidence = qualitySource.filter(
      (row) => (row.evidenceSummary ?? "").toLowerCase() !== "no source summary"
    ).length;
    const withRationale = qualitySource.filter((row) => row.notes.trim().length > 0).length;
    return {
      records: qualitySource.length,
      cities: uniqueCount(qualitySource.map((row) => row.city)),
      types: uniqueCount(qualitySource.map((row) => row.type)),
      fit,
      withEvidence,
      withRationale,
      topTypes,
    };
  }, [qualitySource]);

  const activeRows =
    previewType === "quantity"
      ? fullRows.quantity ?? quantityRows
      : fullRows.quality ?? qualityRows;
  const activeRowsLoading = fullRowsLoading[previewType];
  const activeRowsError = fullRowsError[previewType];
  const filteredRows = useMemo(() => {
    const query = previewQuery.trim().toLowerCase();
    if (!query) return activeRows;
    return activeRows.filter((row) => {
      const parts = [
        row.name,
        row.city,
        row.category,
        row.type,
        row.quantityStatus,
        row.validationStatus,
        row.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return parts.includes(query);
    });
  }, [activeRows, previewQuery]);

  useEffect(() => {
    setPreviewPage(1);
  }, [previewType, previewQuery]);

  const totalPreviewPages = Math.max(
    1,
    Math.ceil(filteredRows.length / PREVIEW_PAGE_SIZE)
  );
  const safePreviewPage = Math.min(previewPage, totalPreviewPages);
  const visibleRows = filteredRows.slice(
    (safePreviewPage - 1) * PREVIEW_PAGE_SIZE,
    safePreviewPage * PREVIEW_PAGE_SIZE
  );
  const hasBlock = (block: { title?: string; text?: string; intro?: string; items?: unknown[]; steps?: unknown[] }) =>
    Boolean(
      (block.title ?? "").trim() ||
      (block.text ?? "").trim() ||
      (block.intro ?? "").trim() ||
      (block.items?.length ?? 0) > 0 ||
      (block.steps?.length ?? 0) > 0
    );

  return (
    <div className="lumira-modal deskresearch-modal deskresearch-modal--dark-text">
      <section className="lumira-modal__brand deskresearch-modal__brand">
        <h3 id="project-modal-title-deskresearch" className="sr-only">
          {model.brand.name}
        </h3>
        <img src={model.brand.logo} alt="Desk Research logo" />
        <div className="lumira-modal__brand-name">{model.brand.name}</div>
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
      </section>

      <section className="lumira-modal__centered">
        {renderStructuredText(model.hero.intro)}
      </section>

      {hasBlock(b1) ? (
        <section className="lumira-modal__centered deskresearch-modal__split-text deskresearch-modal__first-block">
          <h3>{b1.title}</h3>
          {renderStructuredText(b1.text)}
        </section>
      ) : null}

      {hasBlock(b2) ? (
        <section className="lumira-modal__centered deskresearch-modal__split-text">
          <h3>{b2.title}</h3>
          {renderStructuredText(b2.text)}
        </section>
      ) : null}

      {hasBlock(b3) ? (
        <section className="deskresearch-modal__journey">
          <div className="lumira-modal__centered deskresearch-modal__split-text">
            <h3>{b3.title}</h3>
            {renderStructuredText(b3.text)}
          </div>
          <div className="deskresearch-modal__wide">
            <div className="deskresearch-modal__journey-grid">
              {(b3.steps.length > 0 ? b3.steps : []).map((step) => (
                <figure key={step.title} className="deskresearch-modal__journey-item">
                  <div className="deskresearch-modal__journey-icon">
                    {getWorkflowIcon(step.title)}
                  </div>
                  <figcaption>{step.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="deskresearch-sample">
        <div className="lumira-modal__centered deskresearch-modal__split-text">
          <h3>{deskResearchSampleOutput.sectionTitle}</h3>
          <p className="deskresearch-sample__subtitle">{deskResearchSampleOutput.sectionTitleHu}</p>
          <p className="deskresearch-sample__lead">{deskResearchSampleOutput.sectionLead}</p>
          {deskResearchSampleOutput.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="deskresearch-sample__privacy-note">{deskResearchSampleOutput.privacyNote}</p>
        </div>

        <div className="deskresearch-modal__wide">
          <div className="deskresearch-sample__report-grid">
            <article className="deskresearch-sample__report-card">
              <h4>Quantity pipeline</h4>
              <p className="deskresearch-sample__report-subtitle">Széles mapping és shortlist-előkészítés</p>
              <ul>
                <li><span>Összes rekord</span><strong>{quantityStats.records}</strong></li>
                <li><span>Lefedett városok</span><strong>{quantityStats.cities}</strong></li>
                <li><span>Kategóriadiverzitás</span><strong>{quantityStats.categories}</strong></li>
                <li>
                  <span>Fit score tartomány</span>
                  <strong>{quantityStats.fit ? `${quantityStats.fit.min}–${quantityStats.fit.max}` : "n/a"}</strong>
                </li>
                <li><span>Export-ready rekordok</span><strong>{quantityStats.exportReady}</strong></li>
              </ul>
              <div className="deskresearch-sample__top-tags">
                {quantityStats.topCategories.map(([label]) => (
                  <span key={label} className="deskresearch-sample__tag">{toTitleCase(label)}</span>
                ))}
              </div>
            </article>

            <article className="deskresearch-sample__report-card">
              <h4>Quality pipeline</h4>
              <p className="deskresearch-sample__report-subtitle">Mélyebb profilozás és research-ready rekordok</p>
              <ul>
                <li><span>Profilozott rekordok</span><strong>{qualityStats.records}</strong></li>
                <li><span>Lefedett városok</span><strong>{qualityStats.cities}</strong></li>
                <li><span>Entitás-/venue-típus diverzitás</span><strong>{qualityStats.types}</strong></li>
                <li>
                  <span>Fit score tartomány</span>
                  <strong>{qualityStats.fit ? `${qualityStats.fit.min}–${qualityStats.fit.max}` : "n/a"}</strong>
                </li>
                <li><span>Evidence-backed bejegyzések</span><strong>{qualityStats.withEvidence}</strong></li>
                <li><span>Strukturált rationale</span><strong>{qualityStats.withRationale}</strong></li>
              </ul>
              <div className="deskresearch-sample__top-tags">
                {qualityStats.topTypes.map(([label]) => (
                  <span key={label} className="deskresearch-sample__tag">{toTitleCase(label)}</span>
                ))}
              </div>
            </article>

            <article className="deskresearch-sample__report-card">
              <h4>Kliensoldali export</h4>
              <p className="deskresearch-sample__report-subtitle">Átadható deliverable, nem csak AI-válasz</p>
              <p className="deskresearch-sample__report-copy">
                A rendszer outputja nem egyszerű AI-válasz, hanem böngészhető, review-olható és kliensoldalon is átadható research deliverable.
                <br />
                A quantity és quality pipeline-ok ugyanabba a strukturált exportlogikába futnak össze: longlist, shortlist-előkészítés, profilozott rekordok és kutatási összefoglalók egy helyen.
              </p>
              <div className="deskresearch-sample__cta-row">
                <button type="button" className="deskresearch-sample__preview-cta" onClick={() => setPreviewModal("quantity")}>
                  Quantity preview <ArrowUpRight size={16} />
                </button>
                <button type="button" className="deskresearch-sample__preview-cta" onClick={() => setPreviewModal("quality")}>
                  Quality preview <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {hasBlock(b6) ? (
        <section className="lumira-modal__icon-grid">
          <h3>{b6.title}</h3>
          <div className="lumira-modal__icon-grid-items">
            {b6.items.map((item) => (
              <div key={item.title} className="lumira-modal__icon-card">
                <div className="lumira-modal__icon">{iconMap[item.icon ?? ""] ?? <Users />}</div>
                <div className="lumira-modal__icon-title">{item.title}</div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasBlock(b7) ? (
        <section className="lumira-modal__centered deskresearch-modal__split-text">
          <h3>{b7.title}</h3>
          {renderStructuredText(b7.text)}
        </section>
      ) : null}

      {hasBlock(b8) ? (
        <section className="lumira-modal__mood">
          {renderStructuredText(b8.text)}
        </section>
      ) : null}

      {hasBlock(b9) ? (
        <section className="lumira-modal__next">
          <h3>{b9.title}</h3>
          {b9.intro ? renderStructuredText(b9.intro) : null}
          <div className="lumira-modal__next-cards">
            {b9.items.map((item) => (
              <div key={item.title} className="lumira-modal__next-card">
                <div className="lumira-modal__icon-title">{item.title}</div>
                <p>{item.text.replace(/\s*\n\s*/g, " ").trim()}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="lumira-modal__centered deskresearch-modal__split-text">
        <h3>{model.closing.title}</h3>
        {renderStructuredText(model.closing.text)}
      </section>

      <section className="deskresearch-modal__contact">
        <div className="lumira-modal__centered deskresearch-modal__split-text">
          {renderStructuredText(contactIntro)}
        </div>
        <ProjectFeedbackForm
          projectTitle={model.project.title}
          formEndpoint={formEndpoint}
          variant="inverse"
          alwaysOpen
          introText=""
        />
      </section>

      {previewModal ? (
        <div className="deskresearch-preview-modal" role="dialog" aria-modal="true" aria-label="Spreadsheet preview">
          <div className="deskresearch-preview-modal__backdrop" onClick={() => setPreviewModal(null)} />
          <div className="deskresearch-preview-modal__panel">
            <div className="deskresearch-preview-modal__head">
              <h4>Full export preview</h4>
              <button type="button" onClick={() => setPreviewModal(null)} aria-label="Close preview">
                <X size={18} />
              </button>
            </div>
            <div className="deskresearch-preview-modal__switch">
              <button
                type="button"
                className={previewType === "quantity" ? "is-active" : ""}
                onClick={() => setPreviewModal("quantity")}
              >
                {deskResearchSampleOutput.pipelines.quantity.label}
              </button>
              <button
                type="button"
                className={previewType === "quality" ? "is-active" : ""}
                onClick={() => setPreviewModal("quality")}
              >
                {deskResearchSampleOutput.pipelines.quality.label}
              </button>
              <input
                type="search"
                value={previewQuery}
                onChange={(event) => setPreviewQuery(event.target.value)}
                placeholder="Search name, city, type..."
              />
            </div>
            <p className="deskresearch-sample__source-file">
              {previewType === "quantity"
                ? deskResearchSampleOutput.pipelines.quantity.sourceFile
                : deskResearchSampleOutput.pipelines.quality.sourceFile}
              {` | ${activeRows.length} rows`}
            </p>
            <div className="deskresearch-preview-modal__meta">
              <span>
                Showing {filteredRows.length === 0 ? 0 : (safePreviewPage - 1) * PREVIEW_PAGE_SIZE + 1}
                {"-"}
                {Math.min(safePreviewPage * PREVIEW_PAGE_SIZE, filteredRows.length)} of {filteredRows.length}
              </span>
              <div className="deskresearch-preview-modal__pager">
                <button
                  type="button"
                  disabled={safePreviewPage <= 1}
                  onClick={() => setPreviewPage((prev) => Math.max(1, prev - 1))}
                >
                  Prev
                </button>
                <span>{safePreviewPage} / {totalPreviewPages}</span>
                <button
                  type="button"
                  disabled={safePreviewPage >= totalPreviewPages}
                  onClick={() => setPreviewPage((prev) => Math.min(totalPreviewPages, prev + 1))}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="deskresearch-sample__table-wrap">
              <table className="deskresearch-sample__table">
                <thead>
                  {previewType === "quantity" ? (
                    <tr>
                      <th>Name</th>
                      <th>City</th>
                      <th>Category</th>
                      <th>Fit</th>
                      <th>Quantity status</th>
                      <th>Export readiness</th>
                      <th>Rationale</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Name</th>
                      <th>City</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Recommendation</th>
                      <th>Fit</th>
                      <th>Evidence summary</th>
                      <th>Rationale</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {activeRowsLoading ? (
                    <tr>
                      <td colSpan={previewType === "quantity" ? 7 : 8}>Loading full export preview...</td>
                    </tr>
                  ) : null}
                  {!activeRowsLoading && activeRowsError ? (
                    <tr>
                      <td colSpan={previewType === "quantity" ? 7 : 8}>{activeRowsError}</td>
                    </tr>
                  ) : null}
                  {!activeRowsLoading && !activeRowsError && filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={previewType === "quantity" ? 7 : 8}>No rows match this query.</td>
                    </tr>
                  ) : null}
                  {!activeRowsLoading && !activeRowsError
                    ? visibleRows.map((row, index) =>
                    previewType === "quantity" ? (
                      <tr key={`${row.name}-${row.city}-${safePreviewPage}-${index}`}>
                        <td>{row.name}</td>
                        <td>{row.city}</td>
                        <td>{row.category ?? "n/a"}</td>
                        <td>{renderScoreBadge(row.fitScore)}</td>
                        <td>
                          <span className={`deskresearch-sample__chip deskresearch-sample__chip--quantity-${row.quantityStatus ?? "unknown"}`}>
                            {toTitleCase(row.quantityStatus ?? "unknown")}
                          </span>
                        </td>
                        <td>{row.exportReadiness ?? "n/a"}</td>
                        <td>{row.notes}</td>
                      </tr>
                    ) : (
                      <tr key={`${row.name}-${row.city}-${safePreviewPage}-${index}`}>
                        <td>{row.name}</td>
                        <td>{row.city}</td>
                        <td>{row.type ?? "n/a"}</td>
                        <td>
                          <span className={`deskresearch-sample__chip deskresearch-sample__chip--validation-${row.validationStatus ?? "unknown"}`}>
                            {toTitleCase(row.validationStatus ?? "unknown")}
                          </span>
                        </td>
                        <td>{row.recommendation ?? "Pending reviewer recommendation"}</td>
                        <td>{renderScoreBadge(row.fitScore)}</td>
                        <td>{row.evidenceSummary ?? "n/a"}</td>
                        <td>{row.notes}</td>
                      </tr>
                    )
                  )
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
