"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Project } from "@/lib/content/types";
import { projectVisuals } from "@/lib/content/projectVisuals";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionBlock } from "@/components/SectionBlock";
import { LumiraModalNarrative } from "@/components/lumira/LumiraModalNarrative";
import { KincstartoModalNarrative } from "@/components/kincstarto/KincstartoModalNarrative";
import { DerengoModalNarrative } from "@/components/derengo/DerengoModalNarrative";
import { LumiraModalModel } from "@/lib/content/lumiraModalModel";
import { KincstartoModalModel } from "@/lib/content/kincstartoModalModel";
import { DerengoModalModel } from "@/lib/content/derengoModalModel";

type ProjectGalleryProps = {
  topFeatured: Project[];
  kincstarto?: Project;
  featuredRest: Project[];
  rest: Project[];
  lumiraModal?: LumiraModalModel | null;
  kincstartoModal?: KincstartoModalModel | null;
  derengoModal?: DerengoModalModel | null;
};

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

function ProjectModal({
  project,
  onClose,
  lumiraModal,
  kincstartoModal,
  derengoModal,
}: {
  project: Project;
  onClose: () => void;
  lumiraModal?: LumiraModalModel | null;
  kincstartoModal?: KincstartoModalModel | null;
  derengoModal?: DerengoModalModel | null;
}) {
  const visual = projectVisuals[project.slug];
  const isSzarnyfeszito = project.slug === "szarnyfeszito";
  const isLumira = project.slug === "lumira";
  const isKincstarto = project.slug === "kincstarto";
  const isDerengo = project.slug === "derengo";
  const style = visual
    ? ({
        "--card-bg": `url("${visual.background}")`,
        "--card-overlay": visual.overlay,
        "--cta-from": visual.ctaFrom,
        "--cta-to": visual.ctaTo,
      } as CSSProperties)
    : undefined;
  const lumiraStyle = isLumira
    ? ({
        ...style,
        "--card-bg": 'url("/lumira/background.png")',
      } as CSSProperties)
    : style;
  const kincstartoStyle = isKincstarto
    ? ({
        ...style,
        "--card-bg": 'url("/kincstarto/modal_background.png")',
      } as CSSProperties)
    : style;
  const directionStyle = {
    gridTemplateColumns: `repeat(${project.direction.length}, minmax(0, 1fr))`,
  };

  useEffect(() => {
    if (isDerengo) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDerengo, onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`project-modal${isLumira ? " project-modal--lumira" : ""}${isKincstarto ? " project-modal--kincstarto" : ""}${isDerengo ? " project-modal--derengo" : ""}`}
        style={isLumira ? lumiraStyle : isKincstarto ? kincstartoStyle : style}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.slug}`}
      >
        <div className="project-modal__body">
          <div className="project-modal__controls">
            <button
              className="project-modal__close"
              type="button"
              onClick={onClose}
              aria-label="Bezárás"
            >
              ×
            </button>
          </div>

          {isLumira && lumiraModal ? (
            <LumiraModalNarrative model={lumiraModal} />
          ) : isKincstarto && kincstartoModal ? (
            <KincstartoModalNarrative model={kincstartoModal} />
          ) : isDerengo && derengoModal ? (
            <DerengoModalNarrative model={derengoModal} onRequestClose={onClose} />
          ) : (
            <>
              <div className="project-modal__header-block project-card__header project-card__header--split">
                <div className="project-card__brand project-card__brand--center">
                  {visual ? (
                    <img
                      className={`project-card__logo project-card__logo--large${
                        isSzarnyfeszito ? " project-card__logo--xlarge" : ""
                      }`}
                      src={visual.logo}
                      alt={`${project.title} logo`}
                    />
                  ) : null}
                  {!isSzarnyfeszito ? (
                    <h3 id={`project-modal-title-${project.slug}`}>
                      {project.title}
                    </h3>
                  ) : null}
                </div>
                <div className="project-modal__intro">
                  {renderParagraphs(project.what)}
                </div>
              </div>

              <SectionBlock title="Mire való?">
                {renderParagraphs(project.use)}
              </SectionBlock>

              <SectionBlock title="Mit tud jelenleg?">
                <ul className="project-modal__grid project-modal__grid--five">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </SectionBlock>

              <SectionBlock title="Mi benne az egyedi?">
                {renderParagraphs(project.unique)}
              </SectionBlock>

              <SectionBlock title="Állapot">
                {renderParagraphs(project.status)}
              </SectionBlock>

              <SectionBlock title="Fejlődési irányok">
                <ul
                  className="project-modal__grid project-modal__grid--dynamic"
                  style={directionStyle}
                >
                  {project.direction.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </SectionBlock>

              {visual?.appUrl ? (
                <a
                  className="project-modal__cta"
                  href={visual.appUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Fedezd fel a projektet
                </a>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectGallery({
  topFeatured,
  kincstarto,
  featuredRest,
  rest,
  lumiraModal,
  kincstartoModal,
  derengoModal,
}: ProjectGalleryProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const lumira = topFeatured.find((project) => project.slug === "lumira");
  const szarnyfeszito = topFeatured.find(
    (project) => project.slug === "szarnyfeszito"
  );
  const derengo = featuredRest.find((project) => project.slug === "derengo");
  const otherFeaturedRest = featuredRest.filter(
    (project) => project.slug !== "derengo"
  );
  const featuredOrder = [lumira, kincstarto, derengo, szarnyfeszito].filter(
    Boolean
  ) as Project[];

  return (
    <>
      <SectionBlock title="Kiemelt projektek" id="kiemelt-projektek">
        {featuredOrder.length > 0 && (
          <div className="project-grid featured-stack">
            {featuredOrder.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured
                full
                featuredLayout
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
        {otherFeaturedRest.length > 0 && (
          <div className="project-grid two">
            {otherFeaturedRest.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </SectionBlock>

      <SectionBlock title="További projektek">
        <div className="project-grid two">
          {rest.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onSelect={setSelected}
            />
          ))}
        </div>
      </SectionBlock>

      {selected && (
        <ProjectModal
          project={selected}
          onClose={() => setSelected(null)}
          lumiraModal={lumiraModal}
          kincstartoModal={kincstartoModal}
          derengoModal={derengoModal}
        />
      )}
    </>
  );
}
