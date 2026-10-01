/**
 * 3D simplex noise by Ian McEwan and Stefan Gustavson (MIT licence),
 * https://github.com/stegu/webgl-noise
 */
const simplex = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const shapeVertex = /* glsl */ `
uniform float uTime;
uniform float uDistort;
uniform float uFrequency;
uniform float uStretch;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying float vDisplacement;
${simplex}

float field(vec3 p) {
  float n = snoise(p * uFrequency + vec3(0.0, uTime, uTime * 0.6));
  n += 0.5 * snoise(p * uFrequency * 2.1 - vec3(uTime * 0.8, 0.0, uTime));
  return n / 1.5;
}

vec3 displace(vec3 p) {
  vec3 moved = p * (1.0 + field(p) * uDistort);
  moved.y *= uStretch;
  return moved;
}

void main() {
  // Rebuild the normal from two displaced neighbours so shading follows the moving surface.
  vec3 tangent = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 bitangent = normalize(cross(normal, tangent));
  float e = 0.01;
  vec3 p = displace(position);
  vec3 pt = displace(normalize(position + tangent * e));
  vec3 pb = displace(normalize(position + bitangent * e));
  vec3 displacedNormal = normalize(cross(pt - p, pb - p));

  vDisplacement = field(position);
  vNormal = normalize(normalMatrix * displacedNormal);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPosition = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const shapeFragment = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uRim;
uniform vec3 uAccent;
uniform float uFacet;
uniform float uGlow;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  vec3 flatNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
  vec3 n = normalize(mix(normalize(vNormal), flatNormal, uFacet));
  vec3 v = normalize(-vViewPosition);
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
  float light = dot(n, normalize(vec3(0.35, 0.8, 0.5))) * 0.5 + 0.5;

  vec3 color = uBase * (0.5 + 0.5 * light);
  color = mix(color, uRim, fresnel * 0.75);
  // Ridges of the noise field carry the accent, so the surface reads as lit from within.
  color += uAccent * smoothstep(0.25, 0.9, vDisplacement) * uGlow;
  color += uAccent * pow(fresnel, 3.0) * uGlow * 1.4;

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;
