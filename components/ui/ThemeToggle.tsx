'use client';

import { setPref, usePref } from '@/lib/prefs';

export function ThemeToggle() {
  const theme = usePref<'light' | 'dark'>('theme', 'dark');
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      className="control-button"
      type="button"
      onClick={() => setPref('theme', next, 'theme', next)}
      aria-label={`Switch to ${next} theme`}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
      <span className="sr-only">Theme</span>
    </button>
  );
}
