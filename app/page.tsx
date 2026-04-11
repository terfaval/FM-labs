import { loadContent } from "@/lib/content/loadContent";
import { loadLumiraModalContent } from "@/lib/content/lumiraModal";
import { buildLumiraModalModel } from "@/lib/content/lumiraModalModel";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionBlock } from "@/components/SectionBlock";
import { CollaborationBlock } from "@/components/CollaborationBlock";
import { ProjectGallery } from "@/components/ProjectGallery";

export default function HomePage() {
  const content = loadContent();
  const lumiraModal = buildLumiraModalModel(loadLumiraModalContent());

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

  return (
    <main>
      <SiteHeader meta={content.meta} />

      <SectionBlock title="Bemutatkozás">
        <p>{content.meta.about}</p>
      </SectionBlock>

      <ProjectGallery
        topFeatured={topFeatured}
        kincstarto={kincstarto}
        featuredRest={featuredRest}
        rest={rest}
        lumiraModal={lumiraModal}
      />

      <SectionBlock title="Együttmûködés">
        <CollaborationBlock meta={content.meta} />
      </SectionBlock>
    </main>
  );
}
