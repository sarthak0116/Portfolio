/** GLSL for the ring and its light. Everything is additive, so it reads as light. */

export const planeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const noise = /* glsl */ `
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
`;

/** The corona: light streaming off the rim in uneven streamers. The ring's radius is 1. */
export const coronaFragment = /* glsl */ `
${noise}
uniform float uTime;
uniform float uIntensity;
uniform float uExtent;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0 * uExtent;
  float d = length(p);
  float a = atan(p.y, p.x);
  float n = noise(vec2(a * 2.5 + uTime * 0.05, uTime * 0.03)) * 0.6
          + noise(vec2(a * 7.0 - uTime * 0.08, 3.1)) * 0.4;
  float outside = max(d - 1.0, 0.0);
  float streamers = exp(-outside * (1.8 + (1.0 - n) * 2.6));
  float rim = exp(-abs(d - 1.0) * 46.0) * 1.6;
  float edge = smoothstep(uExtent, uExtent * 0.7, d);
  float c = (streamers * 0.5 + rim) * uIntensity * edge * step(1.0 - 0.012, d);
  gl_FragColor = vec4(uColor * c, 1.0);
}
`;

/** The light behind the iris: a hot centre falling off toward the edge. */
export const coreFragment = /* glsl */ `
uniform float uOpen;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float c = pow(max(1.0 - d, 0.0), 1.8) * 2.0 + 0.18 * (1.0 - d);
  gl_FragColor = vec4(uColor * c * uOpen, 1.0);
}
`;

/** A thin horizontal streak (the anamorphic flare) and a four-point star (the diamond-ring bead). */
export const streakFragment = /* glsl */ `
uniform float uIntensity;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float x = abs(vUv.x - 0.5) * 2.0;
  float y = abs(vUv.y - 0.5) * 2.0;
  float c = exp(-y * y * 380.0) * exp(-x * 5.5);
  gl_FragColor = vec4(uColor * c * uIntensity, 1.0);
}
`;

export const starFragment = /* glsl */ `
uniform float uIntensity;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  float core = exp(-r * 22.0);
  float h = exp(-abs(p.y) * 70.0) * exp(-abs(p.x) * 7.0);
  float v = exp(-abs(p.x) * 70.0) * exp(-abs(p.y) * 7.0);
  float c = core * 2.0 + (h + v) * 0.7;
  gl_FragColor = vec4(uColor * c * uIntensity, 1.0);
}
`;

/** The projector beam: a soft fan of light, narrow at the lens, brightest on its centre line. */
export const beamFragment = /* glsl */ `
uniform float uStrength;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float along = vUv.x;
  float across = (vUv.y - 0.5) * 2.0;
  float w = mix(0.03, 1.0, pow(along, 0.8));
  float body = exp(-pow(across / w, 2.0) * 2.2);
  float fade = smoothstep(0.0, 0.08, along) * pow(1.0 - along, 1.2);
  float c = body * fade * uStrength * 0.55;
  gl_FragColor = vec4(uColor * c, 1.0);
}
`;
