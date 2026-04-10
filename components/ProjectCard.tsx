import type { CSSProperties } from "react";
import { Project } from "@/lib/content/types";
import { projectVisuals } from "@/lib/content/projectVisuals";

export function ProjectCard({
  project,
  featured,
  full,
  onSelect
}: {
  project: Project;
  featured?: boolean;
  full?: boolean;
  onSelect?: (project: Project) => void;
}) {
  const visual = projectVisuals[project.slug];
  const style = visual
    ? ({
        "--card-bg": `url("${visual.background}")`,
        "--card-overlay": visual.overlay,
      } as CSSProperties)
    : undefined;

  return (
    <button
      className={`project-card${featured ? " featured" : ""}${
        full ? " full" : ""
      }`}
      type="button"
      style={style}
      onClick={() => onSelect?.(project)}
    >
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
      <div className="project-meta">{project.status}</div>
    </button>
  );
}
