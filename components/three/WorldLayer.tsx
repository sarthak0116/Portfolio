'use client';

import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { usePref } from '@/lib/prefs';
import { pickQuality, qualitySettings, type Quality } from '@/lib/quality';
import { measureStops } from '@/lib/stops';

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

/** Fixed WebGL world behind the page. Renders nothing when 3D is off for this device or preference. */
export function WorldLayer() {
  const motion = usePref<'on' | 'off'>('motion', 'on');
  const [quality, setQuality] = useState<Quality>('off');
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const stops = useRef<number[]>([]);
  // A ?quality= override pins the tier, for testing; otherwise a slow device steps itself down.
  const locked = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const decide = () => {
      if (cancelled) return;
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      const forced = new URLSearchParams(window.location.search).get('quality');
      if (forced === 'high' || forced === 'medium' || forced === 'low' || forced === 'off') {
        locked.current = true;
        setQuality(forced);
        return;
      }
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

  // Sustained low frame rate: high to medium to low, then the 3D world switches off and the page
  // keeps its grade and the ASCII layer.
  const degrade = () => {
    if (locked.current) return;
    setQuality((q) => (q === 'high' ? 'medium' : q === 'medium' ? 'low' : 'off'));
  };

  const active = quality !== 'off' && !lost;
  useEffect(() => {
    // Lets CSS retire the flat hero eclipse once the real ring is on screen.
    document.documentElement.classList.toggle('has-world', active && ready);
    return () => document.documentElement.classList.remove('has-world');
  }, [active, ready]);

  if (!active) return null;
  return (
    <div className="world-layer" data-ready={ready} aria-hidden="true">
      <Boundary>
        <Suspense fallback={null}>
          <Scene
            key={quality}
            settings={qualitySettings[quality]}
            stops={stops}
            onReady={() => setReady(true)}
            onLost={() => setLost(true)}
            onSlow={degrade}
          />
        </Suspense>
      </Boundary>
    </div>
  );
}
