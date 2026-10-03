const acts = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/** The slate for an act: "ACT II — CONTEXT". The number is the section's position, 1-based. */
export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  const act = acts[Number(number) - 1] ?? number;
  return (
    <div className="section-label">
      <span className="eyebrow">
        <span aria-hidden="true">Act {act} — </span>
        {children}
      </span>
    </div>
  );
}
