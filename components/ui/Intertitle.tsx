const acts = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/** The black title card that opens an act. Decorative: the section's own heading carries meaning. */
export function Intertitle({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="intertitle" aria-hidden="true">
      <span className="intertitle-act">Act {acts[Number(number) - 1] ?? number}</span>
      <p className="intertitle-name font-serif">{children}</p>
    </div>
  );
}
