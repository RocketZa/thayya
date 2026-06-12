// ============================================================
// THAYYA hero — "Digital Rangoli" particle shaders
// UI-UX.md ADDENDUM A6. The ONLY file in the codebase allowed
// to carry hardcoded brand hex values (they feed THREE.Color
// uniforms).
//
// ~24k points arranged by polar rangoli/mandala mathematics:
// 12 concentric formations (rose-curve rings, kolam dot rings,
// petal arcs), 12-fold symmetric, slowly rotating, breathing,
// and continuously morphing between formation variants.
// On scroll the mandala loosens into free silk drift — the
// dupatta DNA retained as the dissolve.
// ============================================================

// Five-stop brand gradient (UI-UX.md §3.3), THREE-friendly:
// pass offsets + colors straight into uniform arrays.
export const GRADIENT_STOPS = [
  { offset: 0.0, color: "#F66917" }, // saffron
  { offset: 0.25, color: "#F04226" }, // vermilion
  { offset: 0.5, color: "#BD23A2" }, // rani
  { offset: 0.72, color: "#9F26A7" }, // violet
  { offset: 1.0, color: "#07AEAE" }, // teal
];

// Marigold shimmer tone (A3) — fed to the uMarigold uniform.
export const MARIGOLD = "#FFB627";

export const vertexShader = /* glsl */ `
  attribute float aRing;  // 0–1 ring radius fraction (12 rings)
  attribute float aAngle; // 0–2π base angle on the ring
  attribute float aSeed;  // per-particle random

  uniform float uTime;
  uniform float uScroll;     // 0–1 hero scroll progress
  uniform float uPixelRatio;
  uniform float uPointSize;
  uniform float uRadius;     // outer mandala radius in world units
  uniform vec2  uPointer;    // pointer projected onto the z=0 world plane

  varying float vMix;   // radius fraction → brand gradient sample
  varying float vAlpha;
  varying float vBoost; // pointer-proximity brightness
  varying float vGold;  // 1.0 for marigold shimmer particles

  const float TAU = 6.28318530718;

  void main() {
    // ---- ring bookkeeping -------------------------------------------
    float ringId = floor(aRing * 11.0 + 0.5);     // 0..11
    float kind   = mod(ringId, 3.0);              // 0 rose · 1 kolam dots · 2 petal arcs
    float k0 = 1.0 - step(0.5, kind);             // rose rings
    float k1 = step(0.5, kind) * (1.0 - step(1.5, kind)); // dot rings
    float k2 = step(1.5, kind);                   // petal-arc rings

    // ---- angle: slow rotation (≤0.05), alternating per ring ---------
    float spinDir = mix(1.0, -1.0, mod(ringId, 2.0));
    float th = aAngle + uTime * 0.04 * spinDir;

    // kolam dot rings snap to discrete pulli (dots) with soft jitter
    float dots = 24.0 + ringId * 6.0;
    float thDot = (floor(aAngle / TAU * dots) + 0.5) * (TAU / dots)
                + uTime * 0.04 * spinDir
                + (aSeed - 0.5) * 0.05;
    th = mix(th, thDot, k1);

    // ---- formation variants (continuous evolution) ------------------
    // 12-fold symmetric rose-curve families + plain rings + petal lips
    float rose6  = 0.55 + 0.45 * cos(6.0 * th);
    float rose12 = 0.62 + 0.38 * cos(12.0 * th);
    float petal  = 1.0 + 0.16 * pow(abs(cos(6.0 * th + 1.0471)), 3.0);

    float shapeA = k0 * rose6           + k1 * 1.0                    + k2 * petal;
    float shapeB = k0 * rose12          + k1 * mix(1.0, rose6, 0.4)   + k2 * 1.0;
    float shapeC = k0 * 1.0             + k1 * petal                  + k2 * rose12;

    // slow morph cycle between the three formations
    float m1 = smoothstep(0.0, 1.0, sin(uTime * 0.07) * 0.5 + 0.5);
    float m2 = smoothstep(0.0, 1.0, sin(uTime * 0.045 + 2.1) * 0.5 + 0.5);
    float shape = mix(mix(shapeA, shapeB, m1), shapeC, m2 * 0.6);

    // ---- radius: base ring + shape + breath + scroll loosening ------
    float rBase = mix(0.16, 1.0, aRing) * uRadius;
    // breathing: ~4% radial sine pulse, phase offset per ring
    float breathe = 1.0 + 0.04 * sin(uTime * 0.9 + ringId * 1.7);
    // scroll: the formation expands as the mandala lets go
    float r = rBase * shape * breathe * (1.0 + uScroll * 0.9)
            + (aSeed - 0.5) * 0.05 * uRadius; // soft radial fuzz per particle

    vec3 pos = vec3(r * cos(th), r * sin(th), 0.0);
    // shallow dome: center sits slightly proud, plus per-particle depth
    pos.z += (1.0 - aRing) * 0.35 + (aSeed - 0.5) * 0.5;

    // ---- scroll: curl-noise silk drift (the dupatta dissolve) -------
    float t = uTime * 0.6;
    vec3 curl = vec3(
      sin(th * 3.0 + t + aSeed * TAU) * 0.6 + sin(r * 1.7 - t * 0.5) * 0.4,
      cos(r * 2.0 - t * 0.8 + aSeed * 12.566) * 0.6 + cos(th * 2.0 + t * 0.4) * 0.3,
      sin(t * 0.7 + aSeed * 3.0 + th) * 0.5
    );
    pos += curl * uScroll * (0.8 + aSeed * 0.8);
    pos.y += uScroll * 1.4; // silk lifts away as the hero exits

    // ---- pointer proximity brightening (world space) ----------------
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    float dPtr = distance(worldPos.xy, uPointer);
    vBoost = (1.0 - smoothstep(0.0, 1.5, dPtr)) * 0.6;

    vec4 mvPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = clamp(uPointSize * uPixelRatio * (6.5 / -mvPosition.z), 1.8, 6.5);

    // ---- color + alpha ----------------------------------------------
    vMix = aRing; // radius fraction through saffron→teal
    vGold = step(0.88, aSeed); // ~12% marigold shimmer by seed

    // base alpha 0.45–0.95 by seed, fading with the scroll dissolve
    float alpha = (0.45 + 0.5 * aSeed) * (1.0 - uScroll * 0.9);
    // petal-arc rings break into 12 arcs with soft gaps
    float seg = fract(th / TAU * 12.0);
    float arcMask = smoothstep(0.0, 0.15, seg) * (1.0 - smoothstep(0.85, 1.0, seg));
    alpha *= mix(1.0, 0.15 + 0.85 * arcMask, k2);
    // gentle marigold twinkle: alpha sine by uTime · seed
    alpha *= mix(1.0, 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 40.0), vGold);
    // pointer proximity also lifts alpha (capped to the 0.95 ceiling)
    vAlpha = min(alpha + vBoost * 0.3, 0.95);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColors[5];
  uniform float uStops[5];
  uniform vec3 uMarigold;

  varying float vMix;
  varying float vAlpha;
  varying float vBoost;
  varying float vGold;

  vec3 brandGradient(float t) {
    vec3 col = uColors[0];
    for (int i = 1; i < 5; i++) {
      col = mix(col, uColors[i], smoothstep(uStops[i - 1], uStops[i], t));
    }
    return col;
  }

  void main() {
    // soft circular sprite
    float d = length(gl_PointCoord - 0.5);
    float alpha = (1.0 - smoothstep(0.16, 0.5, d)) * vAlpha;
    if (alpha < 0.02) discard;

    vec3 col = brandGradient(vMix);
    col = mix(col, uMarigold, vGold);   // marigold shimmer particles
    col += vec3(vBoost * 0.35);         // brighten near the pointer

    gl_FragColor = vec4(col, alpha);
  }
`;
