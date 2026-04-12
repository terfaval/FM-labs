export function SectionBlock({
  title,
  id,
  children
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section" id={id}>
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}
