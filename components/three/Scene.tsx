'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, type Group, type Mesh, type MeshBasicMaterial, type ShaderMaterial } from 'three';
import { sections } from '@/config/sections';
import { shapeStates, type ShapeState } from '@/config/shape';
import type { qualitySettings } from '@/lib/quality';
import { scrollState } from '@/lib/scroll-store';
import { blendShapeState, damp } from '@/lib/shape-state';
import { shapeFragment, shapeVertex } from './shaders';

type Settings = (typeof qualitySettings)[keyof typeof qualitySettings];
type Theme = 'light' | 'dark';

const palettes = {
  dark: { base: '#161a10', rim: '#9cbd26', accent: '#d6ff3f', glow: 0.18, wire: '#f3f1eb' },
  light: { base: '#e2decf', rim: '#2c2f1c', accent: '#5b6f00', glow: 0.22, wire: '#11110f' },
} as const;

const states = sections.map((section) => shapeStates[section.id]);

/** Layer A: one noise-displaced form whose pose follows the section in view. */
function MorphingForm({
  detail,
  theme,
  stops,
}: {
  detail: number;
  theme: Theme;
  stops: React.RefObject<number[]>;
}) {
  const mesh = useRef<Mesh>(null);
  const viewport = useThree((state) => state.viewport);
  const current = useRef<ShapeState>({ ...states[0]! });
  const colors = useRef({
    base: new Color(palettes[theme].base),
    rim: new Color(palettes[theme].rim),
    accent: new Color(palettes[theme].accent),
    target: new Color(),
  });

  const material = useRef<ShaderMaterial>(null);
  const materialArgs = useMemo(
    () =>
      [
        {
          vertexShader: shapeVertex,
          fragmentShader: shapeFragment,
          uniforms: {
            uTime: { value: 0 },
            uDistort: { value: states[0]!.distort },
            uFrequency: { value: states[0]!.frequency },
            uStretch: { value: 1 },
            uFacet: { value: 0 },
            uGlow: { value: palettes.dark.glow },
            uBase: { value: new Color() },
            uRim: { value: new Color() },
            uAccent: { value: new Color() },
          },
        },
      ] as const,
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = blendShapeState(scrollState.progress, stops.current ?? [], states);
    const now = current.current;
    for (const key of Object.keys(now) as (keyof ShapeState)[]) {
      now[key] = damp(now[key], target[key], 3.2, dt);
    }

    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime!.value += dt * now.speed;
    u.uDistort!.value = now.distort;
    u.uFrequency!.value = now.frequency;
    u.uStretch!.value = now.stretch;
    u.uFacet!.value = now.facet;

    // Ease colours so a theme switch reads as a change of light, not a cut.
    const palette = palettes[theme];
    const c = colors.current;
    const ease = 1 - Math.exp(-5 * dt);
    c.base.lerp(c.target.set(palette.base), ease);
    c.rim.lerp(c.target.set(palette.rim), ease);
    c.accent.lerp(c.target.set(palette.accent), ease);
    (u.uBase!.value as Color).copy(c.base);
    (u.uRim!.value as Color).copy(c.rim);
    (u.uAccent!.value as Color).copy(c.accent);
    u.uGlow!.value = damp(u.uGlow!.value as number, palette.glow, 5, dt);

    const form = mesh.current;
    if (!form) return;
    // Narrow screens keep the form nearer the centre so it never leaves the viewport.
    const reach = Math.min(1, viewport.aspect / 1.4);
    form.position.x = now.x * (viewport.width / 2) * reach;
    form.position.y = now.y * (viewport.height / 2);
    form.scale.setScalar(now.scale * Math.min(1, 0.55 + viewport.aspect * 0.3));
    form.rotation.y += dt * 0.12;
    form.rotation.x = scrollState.progress * Math.PI * 1.5;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, detail]} />
      <shaderMaterial ref={material} args={materialArgs} />
    </mesh>
  );
}

const kinds = ['torus', 'octa', 'tetra', 'ico', 'knot'] as const;

/** Small wireframe solids spread down the page at different depths; deeper ones drift slower. */
function Satellites({ count, theme }: { count: number; theme: Theme }) {
  const group = useRef<Group>(null);
  const viewport = useThree((state) => state.viewport);
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Golden-ratio spacing gives an even, non-repeating scatter without randomness.
        const g = (i * 0.618034) % 1;
        return {
          kind: kinds[i % kinds.length]!,
          side: i % 2 === 0 ? -1 : 1,
          spread: 0.62 + g * 0.36,
          // Start below the hero so nothing floats over the name on arrival.
          page: 0.18 + (i / count) * 0.8,
          depth: -1 - g * 4.5,
          size: 0.13 + ((i * 0.37) % 1) * 0.2,
          spin: 0.15 + g * 0.35,
        };
      }),
    [count],
  );
  const color = useRef(new Color(palettes[theme].wire));
  const target = useRef(new Color());

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    color.current.lerp(target.current.set(palettes[theme].wire), 1 - Math.exp(-5 * dt));
    group.current?.children.forEach((child, i) => {
      const item = items[i];
      if (!item) return;
      const parallax = 1 / (1 - item.depth * 0.22);
      child.position.x = item.side * item.spread * (viewport.width / 2) * (1 - item.depth * 0.12);
      child.position.y = (scrollState.progress - item.page) * 15 * parallax;
      child.rotation.x += dt * item.spin;
      child.rotation.y += dt * item.spin * 0.7;
      ((child as Mesh).material as MeshBasicMaterial).color.copy(color.current);
    });
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <mesh key={i} position={[0, 0, item.depth]} scale={item.size}>
          {item.kind === 'torus' ? <torusGeometry args={[1, 0.36, 6, 14]} /> : null}
          {item.kind === 'octa' ? <octahedronGeometry args={[1.2, 0]} /> : null}
          {item.kind === 'tetra' ? <tetrahedronGeometry args={[1.3, 0]} /> : null}
          {item.kind === 'ico' ? <icosahedronGeometry args={[1.1, 0]} /> : null}
          {item.kind === 'knot' ? <torusKnotGeometry args={[0.8, 0.26, 32, 5]} /> : null}
          <meshBasicMaterial wireframe transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene({
  settings,
  theme,
  stops,
  onReady,
  onLost,
}: {
  settings: Settings;
  theme: Theme;
  stops: React.RefObject<number[]>;
  onReady: () => void;
  onLost: () => void;
}) {
  return (
    <Canvas
      flat
      dpr={[1, settings.dpr]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ alpha: true, antialias: settings.antialias, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onLost, { once: true });
        onReady();
      }}
    >
      <MorphingForm detail={settings.detail} theme={theme} stops={stops} />
      {settings.satellites > 0 ? <Satellites count={settings.satellites} theme={theme} /> : null}
    </Canvas>
  );
}
