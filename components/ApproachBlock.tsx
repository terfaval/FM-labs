"use client";

import { Compass, Layers, Map, Search } from "lucide-react";

type ApproachItem = {
  title: string;
  text: string;
};

type ApproachBlockProps = {
  intro: string;
  outro?: string;
  items: ApproachItem[];
};

const ICONS = [Search, Layers, Map, Compass];

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function ApproachBlock({ intro, outro, items }: ApproachBlockProps) {
  return (
    <div className="approach-block">
      {intro ? <div className="approach-intro">{renderParagraphs(intro)}</div> : null}
      {items.length > 0 ? (
        <div className="approach-grid">
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div className="approach-card" key={`${item.title}-${index}`}>
                <Icon
                  className="approach-card__icon"
                  strokeWidth={1.1}
                  aria-hidden="true"
                />
                <div className="approach-card__title">{item.title}</div>
                <p className="approach-card__text">{item.text}</p>
              </div>
            );
          })}
        </div>
      ) : null}
      {outro ? <div className="approach-outro">{renderParagraphs(outro)}</div> : null}
    </div>
  );
}
