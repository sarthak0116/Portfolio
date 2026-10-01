import { AnimationToggle } from './AnimationToggle';
import { ThemeToggle } from './ThemeToggle';

export function Controls() {
  return (
    <div className="controls" aria-label="Display controls">
      <AnimationToggle />
      <ThemeToggle />
    </div>
  );
}
