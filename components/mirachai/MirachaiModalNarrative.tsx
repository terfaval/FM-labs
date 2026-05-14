import React from "react";
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";
import type { MirachaiBlock, MirachaiModalModel } from "@/lib/content/mirachaiModalModel";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function renderStructuredText(text: string) {
  const chunks = text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.map((chunk, chunkIndex) => {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const plainLines = lines.filter((line) => !line.startsWith("- "));
    const bulletLines = lines
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^-+\s*/, "").trim());

    return (
      <React.Fragment key={`${chunkIndex}-${chunk}`}>
        {plainLines.length > 0 ? <p>{plainLines.join(" ")}</p> : null}
        {bulletLines.length > 0 ? (
          <p className="mirachai-modal__inline-list">{bulletLines.join(" / ")}</p>
        ) : null}
      </React.Fragment>
    );
  });
}

function TwoScreenBlock({
  block,
  imageRight,
}: {
  block: MirachaiBlock;
  imageRight?: boolean;
}) {
  const primary = block.media[0] ?? "";
  const secondary = block.media[1] ?? "";

  return (
    <section
      className={cx(
        "lumira-modal__split",
        "mirachai-modal__two-screen",
        imageRight && "lumira-modal__split--image-right",
        imageRight
          ? "kincstarto-modal__pair--image-right"
          : "kincstarto-modal__pair--image-left"
      )}
    >
      <div className="lumira-modal__split-image kincstarto-modal__image-group mirachai-modal__image-group">
        {primary ? (
          <img
            className="kincstarto-modal__image kincstarto-modal__image--primary"
            src={primary}
            alt={block.title}
          />
        ) : null}
        {secondary ? (
          <img
            className="kincstarto-modal__image kincstarto-modal__image--secondary"
            src={secondary}
            alt={block.title}
          />
        ) : null}
      </div>
      <div className="lumira-modal__split-text mirachai-modal__split-text">
        <h3>{block.title}</h3>
        {renderStructuredText(block.text)}
      </div>
    </section>
  );
}

function SingleFocusBlock({
  block,
  imageRight,
}: {
  block: MirachaiBlock;
  imageRight?: boolean;
}) {
  const image = block.media[0] ?? "";
  return (
    <section
      className={cx(
        "lumira-modal__split",
        "mirachai-modal__focus",
        imageRight && "lumira-modal__split--image-right"
      )}
    >
      <div className="lumira-modal__split-image">
        {image ? <img src={image} alt={block.title} /> : null}
      </div>
      <div className="lumira-modal__split-text mirachai-modal__split-text">
        <h3>{block.title}</h3>
        {renderStructuredText(block.text)}
      </div>
    </section>
  );
}

function JourneyBlock({ block }: { block: MirachaiBlock }) {
  const stepCards =
    block.steps && block.steps.length > 0
      ? block.steps.map((step, index) => ({
          title: step.title || `Lepes ${index + 1}`,
          text: step.text,
          src: step.media[0] ?? block.media[index] ?? "",
        }))
      : block.media.map((src, index) => ({
          title: `Lepes ${index + 1}`,
          text: "",
          src,
        }));

  return (
    <section className="mirachai-modal__journey">
      <div className="lumira-modal__centered mirachai-modal__journey-copy">
        <h3>{block.title}</h3>
        {renderStructuredText(block.text)}
      </div>
      <div className="mirachai-modal__journey-track">
        {stepCards.map((step, index) => (
          <figure key={`${step.title}-${step.src}-${index}`} className="mirachai-modal__journey-step">
            {step.src ? <img src={step.src} alt={`${block.title} ${index + 1}`} /> : null}
            <figcaption>{step.title}</figcaption>
            {step.text ? <p>{step.text}</p> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

export function MirachaiModalNarrative({ model }: { model: MirachaiModalModel }) {
  const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
  const block02 = model.blocks[1];
  const block03 = model.blocks[2];
  const block04 = model.blocks[3];
  const block05 = model.blocks[4];
  const block06 = model.blocks[5];
  const block07 = model.blocks[6];

  return (
    <div className="lumira-modal mirachai-modal mirachai-modal--dark-text">
      <section className="lumira-modal__brand mirachai-modal__brand">
        <h3 id="project-modal-title-mirachai" className="sr-only">
          {model.brand.name}
        </h3>
        <img src={model.brand.logo} alt="Mirachai logo" />
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
      </section>

      <section className="lumira-modal__centered mirachai-modal__hero-intro-primary">
        {renderStructuredText(model.hero.intro)}
      </section>

      {block02 ? <TwoScreenBlock block={block02} imageRight /> : null}
      {block03 ? <SingleFocusBlock block={block03} /> : null}
      {block04 ? <SingleFocusBlock block={block04} imageRight /> : null}
      {block05 ? <SingleFocusBlock block={block05} /> : null}
      {block06 ? <JourneyBlock block={block06} /> : null}

      {block07 ? (
        <section className="lumira-modal__mood mirachai-modal__text-block">
          <h3>{block07.title}</h3>
          {renderStructuredText(block07.text)}
        </section>
      ) : null}

      <section className="lumira-modal__centered mirachai-modal__closing">
        <h3>{model.closing.title}</h3>
        {renderStructuredText(model.closing.text)}
      </section>

      <div className="project-modal__cta-group project-modal__cta-group--footer">
        <a
          className="project-modal__cta lumira-modal__cta"
          href={model.brand.appUrl}
          target="_blank"
          rel="noreferrer"
        >
          Fedezd fel
        </a>
        <ProjectFeedbackForm
          projectTitle={model.brand.name}
          formEndpoint={formEndpoint}
          variant="default"
        />
      </div>
    </div>
  );
}
