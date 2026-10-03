'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from 'postprocessing';
import { HalfFloatType, UnsignedByteType, Vector2, type WebGLRenderer } from 'three';
import type { WorldPose } from '@/config/world';
import { scrollState } from '@/lib/scroll-store';

/**
 * HDR buffers keep the rim and corona brighter than white, so the bloom has something to bleed.
 * Software renderers (SwiftShader, llvmpipe) advertise them but draw black through the bloom's
 * mip chain, so those fall back to 8-bit, where the bloom still works on what is bright.
 */
function usesSoftwareGL(gl: WebGLRenderer): boolean {
  const ctx = gl.getContext();
  const info = ctx.getExtension('WEBGL_debug_renderer_info');
  const name = info ? String(ctx.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  return /swiftshader|llvmpipe|software/i.test(name);
}

type Stack = {
  composer: EffectComposer;
  bloom: BloomEffect;
  lens: ChromaticAberrationEffect | null;
};

/**
 * Bloom turns the HDR rim, corona and beam into light that bleeds, and (on the top tier) a touch
 * of lens aberration swells with scroll speed. Takes over rendering from R3F.
 */
export function Post({
  aberration,
  multisampling,
  pose,
  flash,
}: {
  aberration: boolean;
  multisampling: number;
  pose: RefObject<WorldPose>;
  flash: RefObject<number>;
}) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const stack = useRef<Stack | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl, {
      frameBufferType: usesSoftwareGL(gl) ? UnsignedByteType : HalfFloatType,
      multisampling,
    });
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new BloomEffect({
      intensity: 1,
      luminanceThreshold: 0.68,
      luminanceSmoothing: 0.2,
      mipmapBlur: true,
      radius: 0.45,
      levels: 5,
    });
    composer.addPass(new EffectPass(camera, bloom));
    let lens: ChromaticAberrationEffect | null = null;
    if (aberration) {
      lens = new ChromaticAberrationEffect({
        offset: new Vector2(0, 0),
        radialModulation: true,
        modulationOffset: 0.3,
      });
      composer.addPass(new EffectPass(camera, lens));
    }
    stack.current = { composer, bloom, lens };
    return () => {
      stack.current = null;
      composer.dispose();
    };
  }, [gl, scene, camera, aberration, multisampling]);

  useEffect(() => {
    stack.current?.composer.setSize(size.width, size.height);
  }, [size.width, size.height, aberration, multisampling]);

  useFrame((_, delta) => {
    const s = stack.current;
    if (!s) return;
    const p = pose.current;
    s.bloom.intensity =
      (0.55 + (p ? p.flare * 0.4 : 0) + (flash.current ?? 0) * 1.2) * (1 - 0.35 * (p?.calm ?? 0));
    if (s.lens) {
      const v = Math.min(Math.abs(scrollState.velocity) * 0.00012, 0.0022);
      s.lens.offset.set(0.0003 + v, 0.0003 + v);
    }
    s.composer.render(delta);
    // A priority above 0 hands the render loop to us.
  }, 1);

  return null;
}
