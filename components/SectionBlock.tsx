export function SectionBlock({
  title,
  id,
  children
}: {
  title?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section" id={id}>
      {title ? <h2 className="section-title">{title}</h2> : null}
      {children}
    </section>
  );
}
