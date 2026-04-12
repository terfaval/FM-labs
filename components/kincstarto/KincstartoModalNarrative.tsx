import React from "react";
import { Bookmark, RotateCcw, Compass } from "lucide-react";
import { KincstartoModalModel } from "@/lib/content/kincstartoModalModel";

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const iconMap: Record<string, React.ReactNode> = {
  bookmark: <Bookmark />,
  "rotate-ccw": <RotateCcw />,
  compass: <Compass />,
};

export function KincstartoModalNarrative({ model }: { model: KincstartoModalModel }) {
  const cta = (
    <a
      className="project-modal__cta lumira-modal__cta"
      href="https://kincstarto.vercel.app"
      target="_blank"
      rel="noreferrer"
    >
      Fedezd fel
    </a>
  );

  return (
    <div className="lumira-modal kincstarto-modal kincstarto-modal--dark-text">
      <section className="lumira-modal__brand">
        <img src={model.brand.logo} alt="Kincstartó logo" />
        <div className="lumira-modal__brand-name">{model.brand.name}</div>
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
        {cta}
      </section>

      <section className="lumira-modal__centered">
        <p>{model.intro.body}</p>
      </section>

      <section className="lumira-modal__icon-grid">
        <h3>{model.principles.title}</h3>
        <div className="lumira-modal__icon-grid-items">
          {model.principles.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">{iconMap[item.icon] ?? <Bookmark />}</div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {model.flowSections.map((section) => (
        <section
          key={section.title}
          className={cx(
            "lumira-modal__split",
            section.imageSide === "right" && "lumira-modal__split--image-right"
          )}
        >
          <div className="lumira-modal__split-image">
            <img src={section.imageSrcs[0]} alt={section.imageAlt} />
            <img src={section.imageSrcs[1]} alt={section.imageAlt} />
          </div>
          <div className="lumira-modal__split-text">
            <h3>{section.title}</h3>
            {section.body.split(/\n\s*\n/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="lumira-modal__mood">
        {model.mood.text.split(/\n/).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      <section className="lumira-modal__next">
        <h3>{model.nextDirections.title}</h3>
        <div className="lumira-modal__next-cards">
          {model.nextDirections.cards.map((card) => (
            <div key={card.title} className="lumira-modal__next-card">
              <div className="lumira-modal__icon-title">{card.title}</div>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__centered">
        <p>{model.closing.body}</p>
      </section>

      {cta}
    </div>
  );
}
