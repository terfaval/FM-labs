"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";
import type { UrbanEcoLabModalModel } from "@/lib/content/urbanEcoLabModalModel";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function renderParagraphs(text: string) {
  return splitParagraphs(text).map((paragraph, index) => (
    <p key={`${paragraph}-${index}`}>{paragraph}</p>
  ));
}

function splitLines(text: string) {
  return text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function UrbanEcoLabModalNarrative({ model }: { model: UrbanEcoLabModalModel }) {
  const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";

  const [activeAgeGroup, setActiveAgeGroup] = useState<number | null>(null);
  const [isAgeGroupImageBroken, setIsAgeGroupImageBroken] = useState(false);

  const [activeSchoolSlide, setActiveSchoolSlide] = useState(0);

  const schoolSlideCount = model.schoolIntegration.items.length;

  const activeSchoolItem = model.schoolIntegration.items[activeSchoolSlide] ?? null;

  const ageGroupPopupSrc = useMemo(() => {
    if (activeAgeGroup === null) return "";
    return model.ageGroups.items[activeAgeGroup]?.slideSrc ?? "";
  }, [activeAgeGroup, model.ageGroups.items]);

  function goToPreviousSchoolSlide() {
    setActiveSchoolSlide((prev) =>
      schoolSlideCount === 0 ? 0 : (prev - 1 + schoolSlideCount) % schoolSlideCount
    );
  }

  function goToNextSchoolSlide() {
    setActiveSchoolSlide((prev) =>
      schoolSlideCount === 0 ? 0 : (prev + 1) % schoolSlideCount
    );
  }

  return (
    <div className="lumira-modal urbanecolab-modal urbanecolab-modal--dark-text">
      <section className="lumira-modal__brand">
        <h3 id="project-modal-title-urbanecolab" className="sr-only">
          {model.brand.name}
        </h3>
        <img className="urbanecolab-modal__logo" src={model.brand.logo} alt={`${model.brand.name} logo`} />
        <div className="lumira-modal__brand-name">{model.brand.name}</div>
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
      </section>

      <section className="lumira-modal__centered">
        {renderParagraphs(model.intro.body)}
      </section>

      <section className="lumira-modal__icon-grid urbanecolab-modal__principles">
        {model.principles.introText ? (
          <div className="urbanecolab-modal__section-intro">
            {renderParagraphs(model.principles.introText)}
          </div>
        ) : null}
        <div className="lumira-modal__icon-grid-items">
          {model.principles.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">
                {item.iconSrc ? (
                  <img src={item.iconSrc} alt="" aria-hidden="true" />
                ) : (
                  <ImageOff aria-hidden="true" />
                )}
              </div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__icon-grid urbanecolab-modal__learning">
        <h3 className="urbanecolab-modal__section-title">{model.learningLogic.title}</h3>
        {model.learningLogic.introText ? (
          <div className="urbanecolab-modal__section-intro">
            {renderParagraphs(model.learningLogic.introText)}
          </div>
        ) : null}

        <div className="lumira-modal__icon-grid-items">
          {model.learningLogic.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">
                {item.iconSrc ? (
                  <img src={item.iconSrc} alt="" aria-hidden="true" />
                ) : (
                  <ImageOff aria-hidden="true" />
                )}
              </div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        {model.learningLogic.outroText ? (
          <div className="urbanecolab-modal__section-outro">
            {renderParagraphs(model.learningLogic.outroText)}
          </div>
        ) : null}
      </section>

      <section className="urbanecolab-modal__competencies">
        <h3 className="urbanecolab-modal__section-title">{model.competencies.title}</h3>
        <div className="urbanecolab-modal__competency-grid" aria-label="Kompetenciák">
          {model.competencies.items.map((item) => (
            <div key={item.title} className="urbanecolab-modal__competency-card">
              <div className="urbanecolab-modal__competency-media" aria-hidden="true">
                {item.imageSrc ? (
                  <img src={item.imageSrc} alt="" aria-hidden="true" />
                ) : (
                  <div className="urbanecolab-modal__image-fallback" aria-hidden="true">
                    <ImageOff />
                  </div>
                )}
              </div>
              <h4 className="urbanecolab-modal__competency-title">{item.title}</h4>
              <div className="urbanecolab-modal__competency-text">{renderParagraphs(item.text)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="urbanecolab-modal__age-groups">
        <h3 className="urbanecolab-modal__section-title">{model.ageGroups.title}</h3>
        <div className="urbanecolab-modal__age-flow">
          {model.ageGroups.items.map((item, index) => (
            <div
              key={item.title}
              className={cx(
                "urbanecolab-modal__age-flow-item",
                index % 2 === 1 && "urbanecolab-modal__age-flow-item--image-right"
              )}
            >
              <div className="urbanecolab-modal__age-visual" aria-hidden="true">
                <img src={item.iconSrc} alt="" aria-hidden="true" />
              </div>
              <div className="urbanecolab-modal__age-copy">
                <h4>{item.title}</h4>
                {renderParagraphs(item.text)}
                {item.details ? (
                  <div className="urbanecolab-modal__age-details">
                    {renderParagraphs(item.details)}
                  </div>
                ) : null}
                <button
                  type="button"
                  className="urbanecolab-modal__more"
                  onClick={() => {
                    setActiveAgeGroup(index);
                    setIsAgeGroupImageBroken(false);
                  }}
                >
                  Bővebben
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="urbanecolab-modal__modules">
        <h3 className="urbanecolab-modal__section-title">{model.modules.title}</h3>
        <div className="urbanecolab-modal__modules-grid">
          {model.modules.items.map((item) => (
            <div key={item.title} className="urbanecolab-modal__module-card">
              <div className="urbanecolab-modal__module-icon" aria-hidden="true">
                {item.imageSrc ? (
                  <img src={item.imageSrc} alt="" aria-hidden="true" />
                ) : (
                  <ImageOff />
                )}
              </div>
              <div className="urbanecolab-modal__module-title">{item.title}</div>
              <p className="urbanecolab-modal__module-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="urbanecolab-modal__school">
        <h3 className="urbanecolab-modal__section-title">{model.schoolIntegration.title}</h3>
        {model.schoolIntegration.introText ? (
          <div className="urbanecolab-modal__section-intro">
            {renderParagraphs(model.schoolIntegration.introText)}
          </div>
        ) : null}

        {activeSchoolItem ? (
          <div className="urbanecolab-modal__carousel">
            <button
              type="button"
              className="urbanecolab-modal__carousel-nav urbanecolab-modal__carousel-nav--prev"
              aria-label="Előző"
              onClick={goToPreviousSchoolSlide}
              disabled={schoolSlideCount <= 1}
            >
              <ChevronLeft />
            </button>

            <div className="urbanecolab-modal__carousel-card">
              <h4>{activeSchoolItem.title}</h4>
              {renderParagraphs(activeSchoolItem.text)}
              {activeSchoolItem.list.length > 0 ? (
                <ul className="urbanecolab-modal__list">
                  {activeSchoolItem.list.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
              <div className="urbanecolab-modal__carousel-indicator">
                {activeSchoolSlide + 1} / {schoolSlideCount}
              </div>
            </div>

            <button
              type="button"
              className="urbanecolab-modal__carousel-nav urbanecolab-modal__carousel-nav--next"
              aria-label="Következő"
              onClick={goToNextSchoolSlide}
              disabled={schoolSlideCount <= 1}
            >
              <ChevronRight />
            </button>
          </div>
        ) : null}

        {model.schoolIntegration.note ? (
          <div className="urbanecolab-modal__note">{renderParagraphs(model.schoolIntegration.note)}</div>
        ) : null}
      </section>

      <section className="lumira-modal__mood urbanecolab-modal__mood">
        {splitLines(model.mood.text).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      <section className="urbanecolab-modal__roadmap">
        <h3 className="urbanecolab-modal__section-title">{model.roadmap.title}</h3>
        {model.roadmap.introText ? (
          <div className="urbanecolab-modal__section-intro">
            {renderParagraphs(model.roadmap.introText)}
          </div>
        ) : null}

        <div
          className={cx(
            "urbanecolab-modal__roadmap-grid",
            model.roadmap.items.length <= 4 && "is-compact"
          )}
        >
          {model.roadmap.items.map((item) => (
            <div key={item.title} className="urbanecolab-modal__roadmap-node">
              <div className="urbanecolab-modal__roadmap-title">
                {item.title}
                {item.subtitle ? <span className="urbanecolab-modal__roadmap-sub">{item.subtitle}</span> : null}
              </div>
              <ul className="urbanecolab-modal__list">
                {splitLines(item.text).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {model.roadmap.goal ? (
          <div className="urbanecolab-modal__goal">{renderParagraphs(model.roadmap.goal)}</div>
        ) : null}
      </section>

      <section className="lumira-modal__centered urbanecolab-modal__closing">
        {renderParagraphs(model.closing.body)}
      </section>

      <section className="urbanecolab-modal__open-call">
        <div className="urbanecolab-modal__open-call-copy">
          {renderParagraphs(model.openCall.text)}
        </div>
        <ProjectFeedbackForm
          projectTitle={model.project.title}
          formEndpoint={formEndpoint}
          variant="default"
          alwaysOpen
          introText=""
        />
      </section>

      {activeAgeGroup !== null ? (
        <div
          className="urbanecolab-modal__popup-backdrop"
          role="presentation"
          onClick={() => setActiveAgeGroup(null)}
        >
          <div
            className="urbanecolab-modal__popup"
            role="dialog"
            aria-modal="true"
            aria-label={model.ageGroups.items[activeAgeGroup]?.title ?? "Korosztály"}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="urbanecolab-modal__popup-close"
              aria-label="Bezárás"
              onClick={() => setActiveAgeGroup(null)}
            >
              <X />
            </button>
            <div className="urbanecolab-modal__popup-image">
              {!isAgeGroupImageBroken && ageGroupPopupSrc ? (
                <img
                  src={ageGroupPopupSrc}
                  alt={model.ageGroups.items[activeAgeGroup]?.title ?? ""}
                  onError={() => setIsAgeGroupImageBroken(true)}
                />
              ) : (
                <div className="urbanecolab-modal__image-fallback" aria-hidden="true">
                  <ImageOff />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
