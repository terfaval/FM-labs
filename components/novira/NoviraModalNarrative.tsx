import React from "react";
import {
  GraduationCap,
  BookOpen,
  Languages,
  Microscope,
  School,
  Library,
  PenTool,
  Columns2,
  BookMarked,
} from "lucide-react";
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";
import type { NoviraModalModel } from "@/lib/content/noviraModalModel";

function renderSingleParagraph(text: string) {
  return <p>{text.replace(/\s*\n\s*/g, " ").trim()}</p>;
}

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap />,
  BookOpen: <BookOpen />,
  Languages: <Languages />,
  Microscope: <Microscope />,
  School: <School />,
  Library: <Library />,
  PenTool: <PenTool />,
  Columns2: <Columns2 />,
  BookMarked: <BookMarked />,
};

export function NoviraModalNarrative({ model }: { model: NoviraModalModel }) {
  const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";

  return (
    <div className="lumira-modal novira-modal novira-modal--dark-text">
      <section className="lumira-modal__centered">
        <h3 className="novira-modal__hero-title">
          {model.hero.title.split("\n").map((line, index) => (
            <span key={`${index}-${line}`} className="novira-modal__hero-line">
              {line}
            </span>
          ))}
        </h3>
      </section>

      <section className="lumira-modal__centered">
        <h3 id="project-modal-title-novira" className="sr-only">
          {model.brand.name}
        </h3>
        <img className="novira-modal__intro-logo" src={model.brand.logo} alt="Novira logo" />
        <h3>{model.intro.title}</h3>
        {renderSingleParagraph(model.intro.text)}
      </section>

      <section className="lumira-modal__icon-grid">
        <h3>{model.principles.title}</h3>
        <div className="lumira-modal__icon-grid-items">
          {model.principles.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">{iconMap[item.icon] ?? <BookMarked />}</div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__split lumira-modal__split--image-right">
        <div className="lumira-modal__split-image">
          <img src={model.library.imageSrc} alt={model.library.imageAlt} />
        </div>
        <div className="lumira-modal__split-text">
          <h3>{model.library.title}</h3>
          {renderSingleParagraph(model.library.text)}
        </div>
      </section>

      <section className="lumira-modal__mood">
        {model.manifesto.quote.split("\n").map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      <section className="lumira-modal__split">
        <div className="lumira-modal__split-image">
          <img src={model.editor.imageSrcs[0]} alt={model.editor.imageAlt} />
        </div>
        <div className="lumira-modal__split-text">
          <h3>{model.editor.title}</h3>
          {renderSingleParagraph(model.editor.text)}
        </div>
      </section>

      <section className="lumira-modal__split lumira-modal__split--image-right">
        <div className="lumira-modal__split-image">
          <img src={model.annotations.imageSrc} alt={model.annotations.imageAlt} />
        </div>
        <div className="lumira-modal__split-text">
          <h3>{model.annotations.title}</h3>
          {renderSingleParagraph(model.annotations.text)}
        </div>
      </section>

      <section className="lumira-modal__icon-grid">
        <h3>{model.audience.title}</h3>
        <div className="lumira-modal__icon-grid-items">
          {model.audience.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">{iconMap[item.icon] ?? <BookOpen />}</div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__centered">
        <h3>{model.future.title}</h3>
        {renderSingleParagraph(model.future.text)}
      </section>

      <div className="project-modal__cta-group project-modal__cta-group--footer">
        <a className="project-modal__cta lumira-modal__cta" href={model.brand.appUrl} target="_blank" rel="noreferrer">
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
