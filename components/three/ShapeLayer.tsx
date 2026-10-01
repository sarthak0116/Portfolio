'use client';

import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { sections } from '@/config/sections';
import { usePref } from '@/lib/prefs';
import { pickQuality, qualitySettings, type Quality } from '@/lib/quality';

// three.js and the scene load only after the page is interactive and only if they will be used.
const Scene = lazy(() => import('./Scene'));

class Boundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    // A broken scene must never take the page down; the static design stands on its own.
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Page progress at which each section's pose should be fully reached. */
function measureStops(): number[] {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  return sections.map((section, index) => {
    if (index === 0) return 0;
    const top = document.getElementById(section.id)?.getBoundingClientRect().top ?? 0;
    return Math.min(1, Math.max(0, (top + window.scrollY - window.innerHeight * 0.35) / max));
  });
}

/** Fixed WebGL backdrop. Renders nothing when 3D is off for this device or preference. */
export function ShapeLayer() {
  const motion = usePref<'on' | 'off'>('motion', 'on');
  const theme = usePref<'light' | 'dark'>('theme', 'dark');
  const [quality, setQuality] = useState<Quality>('off');
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const stops = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    const decide = () => {
      if (cancelled) return;
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      setQuality(
        pickQuality({
          webgl: hasWebGL(),
          motion: motion === 'on',
          memory: nav.deviceMemory,
          cores: nav.hardwareConcurrency,
          width: window.innerWidth,
          saveData: nav.connection?.saveData,
        }),
      );
    };
    // Wait for idle time so the scene never competes with first paint or the intro.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(decide, { timeout: 2500 })
      : window.setTimeout(decide, 600);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [motion]);

  useEffect(() => {
    const measure = () => {
      stops.current = measureStops();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  const active = quality !== 'off' && !lost;
  useEffect(() => {
    // Lets CSS retire the flat hero ring once the real form is on screen.
    document.documentElement.classList.toggle('has-shape', active && ready);
    return () => document.documentElement.classList.remove('has-shape');
  }, [active, ready]);

  if (!active) return null;
  return (
    <div className="shape-layer" data-ready={ready} aria-hidden="true">
      <Boundary>
        <Suspense fallback={null}>
          <Scene
            settings={qualitySettings[quality]}
            theme={theme}
            stops={stops}
            onReady={() => setReady(true)}
            onLost={() => setLost(true)}
          />
        </Suspense>
      </Boundary>
    </div>
  );
}
