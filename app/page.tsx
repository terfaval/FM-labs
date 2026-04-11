import { loadContent } from "@/lib/content/loadContent";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionBlock } from "@/components/SectionBlock";
import { CollaborationBlock } from "@/components/CollaborationBlock";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ApproachBlock } from "@/components/ApproachBlock";
import { AboutBlock } from "@/components/AboutBlock";

export default function HomePage() {
  const content = loadContent();

  const featured = content.featuredProjects;
  const other = content.otherProjects;

  const kincstarto = other.find((project) => project.slug === "kincstarto");
  const topFeaturedSlugs = new Set(["lumira", "szarnyfeszito"]);
  const topFeatured = featured.filter((project) =>
    topFeaturedSlugs.has(project.slug)
  );
  const featuredRest = featured.filter(
    (project) =>
      !topFeaturedSlugs.has(project.slug) && project.slug !== "kincstarto"
  );
  const rest = other.filter((project) => project.slug !== "kincstarto");
  const approachItems = content.meta.approachItems.map((item) => {
    const match = item.match(/\s+(—|–|-)\s+/);
    if (!match || match.index === undefined) {
      return { title: item.trim(), text: "" };
    }
    const splitIndex = match.index;
    const separatorLength = match[0].length;
    const title = item.slice(0, splitIndex).trim();
    const text = item.slice(splitIndex + separatorLength).trim();
    return { title, text };
  });
  const approach = {
    intro: "",
    outro: "",
    items: approachItems.filter((item) => item.title.length > 0),
  };
  const approachParagraphs = content.meta.approach
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  if (approachParagraphs.length > 0) {
    approach.intro = approachParagraphs[0] ?? "";
    approach.outro =
      approachParagraphs.length > 1
        ? approachParagraphs[approachParagraphs.length - 1] ?? ""
        : "";
  }

  return (
    <main>
      <SiteHeader meta={content.meta} />

      <AboutBlock meta={content.meta} />

      <ApproachBlock
        intro={approach.intro}
        outro={approach.outro}
        items={approach.items}
      />

      <ProjectGallery
        topFeatured={topFeatured}
        kincstarto={kincstarto}
        featuredRest={featuredRest}
        rest={rest}
      />

      <SectionBlock title="Együttműködés">
        <CollaborationBlock meta={content.meta} />
      </SectionBlock>
    </main>
  );
}
