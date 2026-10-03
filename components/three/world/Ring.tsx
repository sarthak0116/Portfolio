'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Color,
  DoubleSide,
  MathUtils,
  type Group,
  type LineBasicMaterial,
  type MeshBasicMaterial,
  type Mesh,
  type ShaderMaterial,
} from 'three';
import { BEAM_DIR, CAMERA_FOV, VIEW_DISTANCE } from './constants';
import type { WorldPose } from '@/config/world';
import {
  beamFragment,
  coreFragment,
  coronaFragment,
  planeVertex,
  starFragment,
  streakFragment,
} from './shaders';
import { AMBER, STEEL, WHITE_HOT, Additive, setUniform } from './Additive';

/** The ring's radius in its own units; the pose scales it. */
const R = 1.15;
const BLADES = 8;
/** Seam between iris blades when closed, in radians. */
const GAP = 0.006;
const BEAM_LENGTH = 12;
const BEAM_WIDTH = 5;
const BEAM_ANGLE = Math.atan2(BEAM_DIR.y, BEAM_DIR.x);
/** The diamond-ring bead sits on the rim at this angle. */
const BEAD_ANGLE = 0.5;

function dialTicks(): Float32Array {
  const out: number[] = [];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const inner = R * 1.1;
    const outer = R * (1.1 + (i % 5 === 0 ? 0.12 : 0.05));
    out.push(
      Math.cos(a) * inner,
      Math.sin(a) * inner,
      0,
      Math.cos(a) * outer,
      Math.sin(a) * outer,
      0,
    );
  }
  return new Float32Array(out);
}

/**
 * The ring: an eclipse that is really a closed camera iris. It opens onto light, becomes a
 * projector lens with a beam, a clock dial with a sweeping hand, and finally totality.
 */
export function Ring({
  pose,
  flash,
  progress,
  segments = 28,
}: {
  pose: RefObject<WorldPose>;
  flash: RefObject<number>;
  progress: RefObject<number>;
  segments?: number;
}) {
  const group = useRef<Group>(null);
  const face = useRef<Group>(null);
  const blades = useRef<Group>(null);
  const hand = useRef<Group>(null);
  const dial = useRef<Group>(null);
  const tickMaterial = useRef<LineBasicMaterial>(null);
  const handMaterial = useRef<LineBasicMaterial>(null);
  const rimMaterial = useRef<MeshBasicMaterial>(null);
  const bead = useRef<Mesh>(null);
  const size = useThree((state) => state.size);
  const ticks = useMemo(() => dialTicks(), []);

  const corona = useRef<ShaderMaterial>(null);
  const core = useRef<ShaderMaterial>(null);
  const streak = useRef<ShaderMaterial>(null);
  const star = useRef<ShaderMaterial>(null);
  const beam = useRef<ShaderMaterial>(null);
  const rimColor = useMemo(() => AMBER.clone().multiplyScalar(2.6), []);
  const tickColor = useMemo(() => new Color('#e9e6df'), []);

  useFrame(({ clock }) => {
    const g = group.current;
    const p = pose.current;
    if (!g || !p) return;
    const t = clock.elapsedTime;
    const aspect = size.width / size.height;
    const height = 2 * VIEW_DISTANCE * Math.tan(MathUtils.degToRad(CAMERA_FOV) / 2);
    // Narrow screens keep the ring nearer the centre so it never leaves the frame.
    const reach = Math.min(1, aspect / 1.4);
    g.position.set(p.x * ((height * aspect) / 2) * reach, p.y * (height / 2), 0);
    g.scale.setScalar(p.scale * Math.min(1, 0.55 + aspect * 0.3));
    // Only the ring's face tilts; the beam and flare stay square to the frame.
    face.current?.rotation.set(p.tilt, 0, 0);

    const f = flash.current ?? 0;
    setUniform(corona.current, 'uTime', t);
    // On a portrait screen the ring is a quiet backdrop, never competing with the copy.
    const calm = p.calm;
    setUniform(corona.current, 'uIntensity', p.corona * (1 + f * 0.9) * (1 - 0.5 * calm));
    setUniform(core.current, 'uOpen', Math.pow(p.iris, 1.3) * (1 - 0.82 * calm));
    setUniform(streak.current, 'uIntensity', p.flare * (0.55 + f * 0.9) * (1 - 0.7 * calm));
    rimMaterial.current?.color.copy(rimColor).multiplyScalar(1 - 0.65 * calm);
    setUniform(star.current, 'uIntensity', f);
    setUniform(beam.current, 'uStrength', p.beam);
    if (bead.current) bead.current.visible = f > 0.01;

    // Iris: each blade slides out along its bisector, twists and tilts to catch the light.
    blades.current?.children.forEach((pivot, i) => {
      const open = p.iris;
      pivot.rotation.z = (i / BLADES) * Math.PI * 2 + open * 0.38;
      const blade = pivot.children[0];
      if (!blade) return;
      blade.position.x = open * R * 0.66;
      blade.rotation.x = open * 0.7;
      blade.scale.setScalar(1 - open * 0.22);
    });

    if (dial.current) dial.current.visible = p.dial > 0.01;
    if (tickMaterial.current) tickMaterial.current.opacity = p.dial * 0.7;
    if (handMaterial.current) handMaterial.current.opacity = p.dial;
    // The hand sweeps with scroll, plus a slow tick of its own so the dial is never still.
    if (hand.current) hand.current.rotation.z = -((progress.current ?? 0) * Math.PI * 8 + t * 0.35);
  });

  const wedge = Math.PI / BLADES - GAP;
  return (
    <group ref={group}>
      <mesh position={[0, 0, -0.06]} renderOrder={0}>
        <planeGeometry args={[8, 8]} />
        <Additive
          ref={corona}
          vertex={planeVertex}
          fragment={coronaFragment}
          uniforms={() => ({
            uTime: { value: 0 },
            uIntensity: { value: 1 },
            uExtent: { value: 4 },
            uColor: { value: AMBER.clone().multiplyScalar(1.5) },
          })}
        />
      </mesh>

      <group ref={face}>
        <mesh position={[0, 0, -0.04]} renderOrder={3}>
          <circleGeometry args={[R * 0.97, 64]} />
          <Additive
            ref={core}
            vertex={planeVertex}
            fragment={coreFragment}
            uniforms={() => ({
              uOpen: { value: 0 },
              uColor: { value: AMBER.clone().lerp(WHITE_HOT, 0.3).multiplyScalar(1.1) },
            })}
          />
        </mesh>

        <group ref={blades}>
          {Array.from({ length: BLADES }, (_, i) => (
            <group key={i}>
              <mesh renderOrder={5}>
                <circleGeometry args={[R * 0.995, segments, -wedge, wedge * 2]} />
                <meshStandardMaterial
                  transparent
                  color="#17191d"
                  metalness={0.9}
                  roughness={0.36}
                  side={DoubleSide}
                />
              </mesh>
            </group>
          ))}
        </group>

        <mesh position={[0, 0, 0.01]} renderOrder={6}>
          <torusGeometry args={[R, 0.012, 8, segments * 5]} />
          <meshBasicMaterial ref={rimMaterial} color={rimColor} transparent toneMapped={false} />
        </mesh>

        <group ref={dial}>
          <lineSegments renderOrder={7}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[ticks, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              ref={tickMaterial}
              color={tickColor}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </lineSegments>
          <group ref={hand}>
            <lineSegments renderOrder={7}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0.02, 0, R * 1.02, 0.02]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                ref={handMaterial}
                color={AMBER}
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
              />
            </lineSegments>
          </group>
        </group>
      </group>

      <mesh position={[0, 0, 0.02]} renderOrder={10}>
        <planeGeometry args={[18, 0.9]} />
        <Additive
          ref={streak}
          vertex={planeVertex}
          fragment={streakFragment}
          uniforms={() => ({ uIntensity: { value: 0 }, uColor: { value: STEEL.clone() } })}
        />
      </mesh>
      <mesh
        ref={bead}
        position={[Math.cos(BEAD_ANGLE) * R, Math.sin(BEAD_ANGLE) * R, 0.03]}
        visible={false}
        renderOrder={11}
      >
        <planeGeometry args={[2.6, 2.6]} />
        <Additive
          ref={star}
          vertex={planeVertex}
          fragment={starFragment}
          uniforms={() => ({
            uIntensity: { value: 0 },
            uColor: { value: WHITE_HOT.clone().multiplyScalar(1.6) },
          })}
        />
      </mesh>

      {/* The projector beam leaves the lens and crosses the frame. */}
      <mesh
        position={[
          (Math.cos(BEAM_ANGLE) * BEAM_LENGTH) / 2,
          (Math.sin(BEAM_ANGLE) * BEAM_LENGTH) / 2,
          -0.03,
        ]}
        rotation={[0, 0, BEAM_ANGLE]}
        renderOrder={1}
      >
        <planeGeometry args={[BEAM_LENGTH, BEAM_WIDTH]} />
        <Additive
          ref={beam}
          vertex={planeVertex}
          fragment={beamFragment}
          uniforms={() => ({
            uStrength: { value: 0 },
            uColor: { value: AMBER.clone().lerp(WHITE_HOT, 0.3) },
          })}
        />
      </mesh>
    </group>
  );
}
