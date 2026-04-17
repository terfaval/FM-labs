import type { CSSProperties } from "react";
import { Project } from "@/lib/content/types";
import { projectVisuals } from "@/lib/content/projectVisuals";

export function ProjectCard({
  project,
  featured,
  full,
  panel,
  featuredLayout,
  onSelect,
}: {
  project: Project;
  featured?: boolean;
  full?: boolean;
  panel?: boolean;
  featuredLayout?: boolean;
  onSelect?: (project: Project) => void;
}) {
  const visual = projectVisuals[project.slug];
  const style = visual
    ? ({
        "--card-bg": `url("${visual.background}")`,
        "--card-overlay": visual.overlay,
        "--cta-from": visual.ctaFrom,
        "--cta-to": visual.ctaTo,
      } as CSSProperties)
    : undefined;

  const panelClass =
    panel && project.slug === "lumira" ? " panel--lumira" : "";

  return (
    <button
      className={`project-card${featured ? " featured" : ""}${
        full ? " full" : ""
      }${panel ? " panel" : ""}${panelClass}${
        featuredLayout ? " project-card--split" : ""
      }${project.slug === "lumira" ? " project-card--lumira-glass" : ""}${
        project.slug === "kincstarto" ? " project-card--kincstarto" : ""
      }${project.slug === "derengo" ? " project-card--derengo" : ""
      }${project.slug === "szarnyfeszito" ? " project-card--szarnyfeszito" : ""
      }`}
      type="button"
      style={style}
      onClick={() => onSelect?.(project)}
    >
      {panel ? (
        <div className="project-card__panel">
          <div className="project-card__panel-brand">
            {visual ? (
              <img
                className="project-card__logo project-card__logo--panel"
                src={visual.logo}
                alt={`${project.title} logo`}
              />
            ) : null}
          </div>
          <div className="project-card__panel-body">
            <p className="project-card__hero">{project.hero}</p>
            <p className="project-card__summary">{project.card}</p>
            <span className="project-modal__cta project-card__cta">
              Ismerd meg
            </span>
          </div>
        </div>
      ) : featuredLayout ? (
        <div
          className={`project-card__split${
            project.slug === "kincstarto" || project.slug === "szarnyfeszito"
              ? " project-card__split--reverse"
              : ""
          }`}
        >
          <div className="project-card__brand-col">
            {visual ? (
              <img
                className={`project-card__logo project-card__logo--huge${
                  project.slug === "szarnyfeszito"
                    ? " project-card__logo--xxlarge"
                    : ""
                }`}
                src={visual.logo}
                alt={`${project.title} logo`}
              />
            ) : null}
            {project.slug !== "szarnyfeszito" ? (
              <h3
                className={`project-card__title${
                  project.slug === "lumira"
                    ? " project-card__title--lumira"
                    : ""
                }`}
              >
                {project.slug === "lumira"
                  ? project.title.toLowerCase()
                  : project.title}
              </h3>
            ) : null}
          </div>
          <div className="project-card__content">
            <p className="project-card__hero">
              {project.slug === "szarnyfeszito" ? project.card : project.hero}
            </p>
            {project.status ? (
              <div className="project-meta">{project.status}</div>
            ) : null}
            <span className="project-modal__cta project-card__cta">
              Ismerd meg
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="project-card__header">
            {visual ? (
              <img
                className="project-card__logo"
                src={visual.logo}
                alt={`${project.title} logo`}
              />
            ) : null}
            <h3 className="project-card__title">{project.title}</h3>
          </div>
          <p>{project.hero}</p>
          {project.status ? <div className="project-meta">{project.status}</div> : null}
        </>
      )}
    </button>
  );
}
