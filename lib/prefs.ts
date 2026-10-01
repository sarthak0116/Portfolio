'use client';

import { useSyncExternalStore } from 'react';

type PrefKey = 'theme' | 'motion';

/** Preferences live on <html data-*> (set before paint by themeScript), so CSS and JS agree. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-motion'],
  });
  return () => observer.disconnect();
}

export function usePref<T extends string>(key: PrefKey, fallback: T): T {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset[key] as T | undefined) ?? fallback,
    () => fallback,
  );
}

export function setPref(key: PrefKey, value: string, storageKey: string, stored: string) {
  const root = document.documentElement;
  if (key === 'theme') {
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 500);
  }
  root.dataset[key] = value;
  try {
    localStorage.setItem(storageKey, stored);
  } catch {
    // Storage can be blocked (private mode); the attribute still applies for this visit.
  }
}
