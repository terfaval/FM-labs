import React from "react";
import { Compass, Map, Layers } from "lucide-react";
import { SzarnyfeszitoModalModel } from "@/lib/content/szarnyfeszitoModalModel";
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}

const lucideIconMap: Record<string, React.ReactNode> = {
  compass: <Compass />,
  map: <Map />,
  layers: <Layers />,
};

function SingleImageBlock({
  title,
  body,
  imageSrc,
  imageAlt,
  imageSide,
}: {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
}) {
  const imageRight = imageSide === "right";
  return (
    <section
      className={cx(
        "lumira-modal__split",
        imageRight && "lumira-modal__split--image-right"
      )}
    >
      <div className="lumira-modal__split-image">
        <img src={imageSrc} alt={imageAlt} />
      </div>
      <div className="lumira-modal__split-text">
        <h3>{title}</h3>
        {renderParagraphs(body)}
      </div>
    </section>
  );
}

function TwoImageBlock({
  title,
  body,
  imageSrcs,
  imageAlt,
  imageSide,
}: {
  title: string;
  body: string;
  imageSrcs: [string, string];
  imageAlt: string;
  imageSide: "left" | "right";
}) {
  const imageRight = imageSide === "right";
  return (
    <section
      className={cx(
        "lumira-modal__split",
        imageRight && "lumira-modal__split--image-right",
        imageRight ? "kincstarto-modal__pair--image-right" : "kincstarto-modal__pair--image-left"
      )}
    >
      <div className="lumira-modal__split-image kincstarto-modal__image-group">
        <img
          className="kincstarto-modal__image kincstarto-modal__image--primary"
          src={imageSrcs[0]}
          alt={imageAlt}
        />
        <img
          className="kincstarto-modal__image kincstarto-modal__image--secondary"
          src={imageSrcs[1]}
          alt={imageAlt}
        />
      </div>
      <div className="lumira-modal__split-text">
        <h3>{title}</h3>
        {renderParagraphs(body)}
      </div>
    </section>
  );
}

export function SzarnyfeszitoModalNarrative({ model }: { model: SzarnyfeszitoModalModel }) {
  const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
  const ctaHeader = model.brand.appUrl ? (
    <div className="project-modal__cta-group">
      <a
        className="project-modal__cta lumira-modal__cta"
        href={model.brand.appUrl}
        target="_blank"
        rel="noreferrer"
      >
        Fedezd fel
      </a>
    </div>
  ) : null;
  const ctaFooter = (
    <div className="project-modal__cta-group project-modal__cta-group--footer">
      {model.brand.appUrl ? (
        <a
          className="project-modal__cta lumira-modal__cta"
          href={model.brand.appUrl}
          target="_blank"
          rel="noreferrer"
        >
          Fedezd fel
        </a>
      ) : null}
      <ProjectFeedbackForm
        projectTitle={model.brand.name}
        formEndpoint={formEndpoint}
        variant="default"
      />
    </div>
  );

  return (
    <div className="lumira-modal szarnyfeszito-modal szarnyfeszito-modal--dark-text">
      <section className="lumira-modal__brand">
        <h3 id="project-modal-title-szarnyfeszito" className="sr-only">
          {model.brand.name}
        </h3>
        <img src={model.brand.logo} alt="Szárnyfeszítő logo" />
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
        {ctaHeader}
      </section>

      <section className="lumira-modal__centered">
        {renderParagraphs(model.kiindulo.body)}
      </section>

      <section className="lumira-modal__icon-grid szarnyfeszito-modal__principles">
        <h3>{model.mukodesiElv.title}</h3>
        <div className="lumira-modal__icon-grid-items">
          {model.mukodesiElv.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">
                {lucideIconMap[item.icon] ?? <Compass />}
              </div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__icon-grid szarnyfeszito-modal__who">
        <h3>{model.kinekSzol.title}</h3>
        <div className="lumira-modal__icon-grid-items">
          {model.kinekSzol.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">
                <img src={item.iconSrc} alt="" aria-hidden="true" />
              </div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__icon-grid">
        <h3>{model.hogyanKezddEl.title}</h3>
        <div className="lumira-modal__icon-grid-items">
          {model.hogyanKezddEl.steps.map((step, index) => (
            <div key={step.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">
                <span className="szarnyfeszito-modal__step-number">{index + 1}</span>
              </div>
              <div className="lumira-modal__icon-title">{step.title}</div>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <SingleImageBlock {...model.terkepCore} />
      <SingleImageBlock {...model.madarKatalogus} />
      <TwoImageBlock {...model.madarMegfigyeles} />

      <section className="lumira-modal__mood">
        {model.mood.text.split(/\n/).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      <SingleImageBlock {...model.helyszinekHalo} />
      <TwoImageBlock {...model.helyszinElozetes} />

      <section className="lumira-modal__next">
        <h3>{model.kovetkezoIranyok.title}</h3>
        <div className="lumira-modal__next-cards">
          {model.kovetkezoIranyok.cards.map((card) => (
            <div key={card.title} className="lumira-modal__next-card">
              <div className="lumira-modal__icon-title">{card.title}</div>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__centered">
        {renderParagraphs(model.closing.body)}
      </section>

      {ctaFooter}
    </div>
  );
}
