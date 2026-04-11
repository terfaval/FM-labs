"use client";

import { Meta } from "@/lib/content/types";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

const ABOUT_IMAGES = [
  "/about/Slide1.PNG",
  "/about/Slide2.PNG",
  "/about/Slide3.PNG",
  "/about/Slide4.PNG",
];

export function AboutBlock({ meta }: { meta: Meta }) {
  return (
    <section className="section about-block">
      <div className="about-block__text">{renderParagraphs(meta.about)}</div>
      <div className="about-block__grid">
        {ABOUT_IMAGES.map((src) => (
          <img className="about-block__image" key={src} src={src} alt="" />
        ))}
      </div>
    </section>
  );
}
