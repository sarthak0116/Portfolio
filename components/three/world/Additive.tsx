import { useMemo, type Ref } from 'react';
import { AdditiveBlending, Color, type IUniform, type ShaderMaterial } from 'three';

/** HDR tungsten and cool steel. Values above 1 are what the bloom pass picks up. */
export const AMBER = new Color('#e9b06a');
export const WHITE_HOT = new Color('#fff1da');
export const STEEL = new Color('#9fc4ff');

/**
 * A transparent, additive ShaderMaterial: light adds, it never occludes and never depth-tests. The uniforms are created
 * once; callers keep a ref and write `ref.current.uniforms.x.value` each frame.
 */
export function Additive({
  ref,
  vertex,
  fragment,
  uniforms,
  doubleSided = false,
}: {
  ref: Ref<ShaderMaterial>;
  vertex: string;
  fragment: string;
  uniforms: () => Record<string, IUniform>;
  doubleSided?: boolean;
}) {
  const args = useMemo(
    () =>
      [
        {
          vertexShader: vertex,
          fragmentShader: fragment,
          uniforms: uniforms(),
          transparent: true,
          depthWrite: false,
          // Light never depth-tests: tilted geometry would otherwise intersect it. The ring's
          // renderOrder decides what covers what instead.
          depthTest: false,
          blending: AdditiveBlending,
          side: doubleSided ? 2 : 0,
        },
      ] as const,
    // Built once; the uniforms are mutated in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return <shaderMaterial ref={ref} args={args} />;
}

/** Writes one uniform on a material held in a ref, if it has mounted. */
export function setUniform(material: ShaderMaterial | null, name: string, value: number) {
  const uniform = material?.uniforms[name];
  if (uniform) uniform.value = value;
}
