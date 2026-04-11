"use client";

import React from "react";
import type { ReactNode } from "react";
import {
  SearchCheck,
  PauseCircle,
  RotateCcw,
  BookMarked,
  Sparkles,
  MoonStar,
} from "lucide-react";
import { LumiraModalModel, FlowSectionModel } from "@/lib/content/lumiraModalModel";

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SplitSection({ section }: { section: FlowSectionModel }) {
  const imageFirst = section.imageSide === "left";
  return (
    <section className="lumira-modal__split">
      <div className={cx("lumira-modal__split-image", imageFirst && "is-first")}>
        <img src={section.imageSrc} alt={section.imageAlt} />
      </div>
      <div className="lumira-modal__split-text">
        <div className="lumira-modal__overline">{section.overline}</div>
        <h3>{section.title}</h3>
        <p>{section.body}</p>
        <div className="lumira-modal__caption">{section.caption}</div>
      </div>
    </section>
  );
}

function CenteredTextBlock({ title, body }: { title?: string; body: string }) {
  return (
    <section className="lumira-modal__centered">
      {title ? <h3>{title}</h3> : null}
      <p>{body}</p>
    </section>
  );
}

function MoodBlock({ text }: { text: string }) {
  return (
    <section className="lumira-modal__mood">
      <p>{text}</p>
    </section>
  );
}

function IconGrid({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: { icon: string; title: string; text: string }[];
}) {
  const iconMap: Record<string, ReactNode> = {
    SearchCheck: <SearchCheck />,
    ScanSearch: <SearchCheck />,
    PauseCircle: <PauseCircle />,
    CornerUpLeft: <RotateCcw />,
    RotateCcw: <RotateCcw />,
  };

  return (
    <section className="lumira-modal__icon-grid">
      <h3>{title}</h3>
      <p className="lumira-modal__icon-grid-intro">{intro}</p>
      <div className="lumira-modal__icon-grid-items">
        {items.map((item) => (
          <div key={item.title} className="lumira-modal__icon-card">
            <div className="lumira-modal__icon">
              {iconMap[item.icon] ?? <SearchCheck />}
            </div>
            <div className="lumira-modal__icon-title">{item.title}</div>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NextCards({
  title,
  intro,
  cards,
}: {
  title: string;
  intro: string;
  cards: { icon: string; title: string; text: string }[];
}) {
  const iconMap: Record<string, ReactNode> = {
    BookMarked: <BookMarked />,
    Library: <BookMarked />,
    Sparkles: <Sparkles />,
    Stars: <Sparkles />,
    MoonStar: <MoonStar />,
  };

  return (
    <section className="lumira-modal__next">
      <h3>{title}</h3>
      <p className="lumira-modal__next-intro">{intro}</p>
      <div className="lumira-modal__next-cards">
        {cards.map((card) => (
          <div key={card.title} className="lumira-modal__next-card">
            <div className="lumira-modal__icon">
              {iconMap[card.icon] ?? <BookMarked />}
            </div>
            <div className="lumira-modal__icon-title">{card.title}</div>
            <p>{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LumiraModalNarrative({ model }: { model: LumiraModalModel }) {
  return (
    <div className="lumira-modal">
      <section className="lumira-modal__brand">
        <img src={model.brand.logo} alt="Lumira logo" />
        <div className="lumira-modal__brand-name">{model.brand.name}</div>
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
      </section>

      <CenteredTextBlock title={model.kiindulo.title} body={model.kiindulo.body} />

      {model.flowSections.slice(0, 2).map((section) => (
        <SplitSection key={section.title} section={section} />
      ))}

      {model.mood.first ? <MoodBlock text={model.mood.first} /> : null}

      {model.flowSections.slice(2, 3).map((section) => (
        <SplitSection key={section.title} section={section} />
      ))}

      <IconGrid {...model.principles} />

      {model.flowSections.slice(3, 5).map((section) => (
        <SplitSection key={section.title} section={section} />
      ))}

      <NextCards {...model.nextDirections} />

      <CenteredTextBlock body={model.closing.body} />
    </div>
  );
}
