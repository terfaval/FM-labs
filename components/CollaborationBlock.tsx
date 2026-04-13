import { Meta } from "@/lib/content/types";
import { ContactSection } from "@/components/ContactSection";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function CollaborationBlock({ meta }: { meta: Meta }) {
  return (
    <div className="collaboration-block">
      {renderParagraphs(meta.collaboration)}
      <ContactSection meta={meta} formEndpoint={process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? ""} centered />
    </div>
  );
}
