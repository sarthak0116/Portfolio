'use client';

import { setPref, usePref } from '@/lib/prefs';

export function AnimationToggle() {
  const reduced = usePref<'on' | 'off'>('motion', 'on') === 'off';
  return (
    <button
      className="control-button control-button-wide"
      type="button"
      onClick={() => setPref('motion', reduced ? 'on' : 'off', 'skip-animations', String(!reduced))}
      aria-pressed={reduced}
    >
      {reduced ? 'Motion off' : 'Motion on'}
    </button>
  );
}
