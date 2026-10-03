'use client';

import { useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { poses, FLASH_AT, type WorldPose } from '@/config/world';
import { sections } from '@/config/sections';
import { damp, journeyIndex } from '@/lib/journey';
import { adaptPose, bump, mixPoses } from '@/lib/pose';
import type { qualitySettings } from '@/lib/quality';
import { renderStats } from '@/lib/render-stats';
import { scrollState } from '@/lib/scroll-store';
import { CAMERA_FOV, VIEW_DISTANCE } from './world/constants';
import { Post } from './world/Post';
import { Ring } from './world/Ring';

type Settings = (typeof qualitySettings)[keyof typeof qualitySettings];

const list = sections.map((section) => poses[section.id]);

/**
 * The world: one ring in a dark room. The camera is a handheld one, so it breathes
 * and leans toward the pointer. The ring's pose follows the act in view.
 */
function World({
  settings,
  stops,
  onSlow,
}: {
  settings: Settings;
  stops: RefObject<number[]>;
  onSlow: () => void;
}) {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const index = useRef(0);
  const pose = useRef<WorldPose>({ ...list[0]! });
  const flash = useRef(0);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const stats = useRef({ frames: 0, since: 0, born: 0, slow: 0, reported: false });

  // Runs before the children so they all read this frame's pose.
  useFrame(({ camera, clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    index.current = damp(
      index.current,
      journeyIndex(scrollState.progress, stops.current ?? []),
      8,
      dt,
    );
    Object.assign(pose.current, adaptPose(mixPoses(list, index.current), size.width / size.height));
    flash.current = bump(index.current, FLASH_AT, 0.3);
    progress.current = scrollState.progress;

    const t = clock.elapsedTime;
    const m = pointer.current;
    m.x = damp(m.x, m.tx, 2.5, dt);
    m.y = damp(m.y, m.ty, 2.5, dt);
    // Handheld: a slow breath, never a shake.
    camera.position.set(
      Math.sin(t * 0.21) * 0.035 + m.x * 0.14,
      Math.cos(t * 0.17) * 0.03 + m.y * 0.09,
      VIEW_DISTANCE,
    );
    camera.rotation.set(0, 0, Math.sin(t * 0.13) * 0.004);
    camera.lookAt(0, 0, 0);

    // The previous frame is complete now: publish its cost, then start counting afresh.
    const s = stats.current;
    s.frames++;
    const now = performance.now();
    if (s.since === 0) s.since = now;
    if (now - s.since >= 500) {
      renderStats.fps = Math.round((s.frames * 1000) / (now - s.since));
      renderStats.calls = gl.info.render.calls;
      renderStats.triangles = gl.info.render.triangles;
      renderStats.live = true;
      s.frames = 0;
      s.since = now;
      // Judge only after a warm-up (shader compiles, fonts), and only a sustained run of slow
      // windows, so one hitch never costs the visitor their 3D.
      if (s.born === 0) s.born = now;
      s.slow = now - s.born > 5000 && renderStats.fps < 22 ? s.slow + 1 : 0;
      if (s.slow >= 8 && !s.reported) {
        s.reported = true;
        onSlow();
      }
    }
    gl.info.reset();
  }, -1);

  // Pointer parallax is read from the window: the canvas itself never takes events.
  const bound = useRef(false);
  useFrame(() => {
    if (bound.current) return;
    bound.current = true;
    window.addEventListener(
      'pointermove',
      (event) => {
        pointer.current.tx = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.current.ty = -(event.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true },
    );
  });

  return (
    <>
      {/* Reflections for the iris blades: strips of light from the sides, none from the front,
          so a closed iris reads as black and an open one catches glints. */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={6}
          color="#ffb870"
          position={[6, 2, 1]}
          scale={[3, 8, 1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#9fc4ff"
          position={[-6, 3, 0]}
          scale={[3, 8, 1]}
          rotation-y={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#ffffff"
          position={[0, 6, -2]}
          scale={[10, 2, 1]}
          rotation-x={Math.PI / 2}
        />
      </Environment>
      <Ring pose={pose} flash={flash} progress={progress} segments={settings.segments} />
      {settings.post ? (
        <Post
          aberration={settings.aberration}
          multisampling={settings.multisampling}
          pose={pose}
          flash={flash}
        />
      ) : null}
    </>
  );
}

export default function Scene({
  settings,
  stops,
  onReady,
  onLost,
  onSlow,
}: {
  settings: Settings;
  stops: RefObject<number[]>;
  onReady: () => void;
  onLost: () => void;
  onSlow: () => void;
}) {
  return (
    <Canvas
      flat
      dpr={[1, settings.dpr]}
      camera={{ position: [0, 0, VIEW_DISTANCE], fov: CAMERA_FOV, near: 0.1, far: 60 }}
      // The composer owns antialiasing when post-processing runs.
      gl={{ antialias: !settings.post, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#040405');
        // The world counts a whole frame, which may span several passes.
        gl.info.autoReset = false;
        scene.background = null;
        gl.domElement.addEventListener('webglcontextlost', onLost, { once: true });
        onReady();
      }}
    >
      <World settings={settings} stops={stops} onSlow={onSlow} />
    </Canvas>
  );
}
