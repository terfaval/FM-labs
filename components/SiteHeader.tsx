import { Meta } from "@/lib/content/types";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function SiteHeader({ meta }: { meta: Meta }) {
  return (
    <section className="section">
      <h1 className="hero-title">{meta.title}</h1>
      <div className="hero-role">{meta.role}</div>
      <p>{meta.tagline}</p>
      {renderParagraphs(meta.intro)}
    </section>
  );
}
