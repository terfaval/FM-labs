import { Meta } from "@/lib/content/types";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function CollaborationBlock({ meta }: { meta: Meta }) {
  return <>{renderParagraphs(meta.collaboration)}</>;
}
