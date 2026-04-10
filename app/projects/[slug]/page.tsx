import Link from "next/link";
import { notFound } from "next/navigation";
import { loadContent } from "@/lib/content/loadContent";
import { SectionBlock } from "@/components/SectionBlock";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = loadContent();
  const allProjects = [...content.featuredProjects, ...content.otherProjects];
  const project = allProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <Link href="/" className="back-link">
        Vissza a főoldalra
      </Link>
      <h1 className="hero-title">{project.title}</h1>
      <p>{project.hero}</p>
      <p className="project-meta">{project.card}</p>

      <SectionBlock title="Mi ez a projekt?">
        {renderParagraphs(project.what)}
      </SectionBlock>

      <SectionBlock title="Mire való?">
        {renderParagraphs(project.use)}
      </SectionBlock>

      <SectionBlock title="Mit tud jelenleg?">
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title="Mi benne az egyedi?">
        {renderParagraphs(project.unique)}
      </SectionBlock>

      <SectionBlock title="Állapot">
        {renderParagraphs(project.status)}
      </SectionBlock>

      <SectionBlock title="Fejlődési irányok">
        <ul>
          {project.direction.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionBlock>
    </main>
  );
}
