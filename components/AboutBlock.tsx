"use client";

import { Meta } from "@/lib/content/types";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function AboutBlock({ meta }: { meta: Meta }) {
  return (
    <section className="section about-block">
      <div className="about-block__text">{renderParagraphs(meta.about)}</div>
      <div className="about-block__grid">
        <img className="about-block__image" src="/about/ABOUT.png" alt="" />
      </div>
    </section>
  );
}
