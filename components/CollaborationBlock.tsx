import { Meta } from "@/lib/content/types";
import { ContactSection } from "@/components/ContactSection";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function CollaborationBlock({ meta }: { meta: Meta }) {
  const paragraphs = meta.collaboration
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const lead = paragraphs[0] ?? "";
  const followup = paragraphs.slice(1);

  return (
    <div className="collaboration-block">
      {lead ? <div className="collaboration-copy">{renderParagraphs(lead)}</div> : null}
      <ContactSection
        meta={meta}
        formEndpoint={process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? ""}
        centered
        afterLinks={
          followup.length > 0 ? (
            <div className="collaboration-followup">
              {followup.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null
        }
      />
    </div>
  );
}
