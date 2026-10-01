export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span className="section-number" aria-hidden="true">
        {number}
      </span>
      <span className="eyebrow">{children}</span>
    </div>
  );
}
