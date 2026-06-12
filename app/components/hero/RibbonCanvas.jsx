"use client";

// THAYYA hero — "Digital Rangoli" (UI-UX.md A6)
// GPU particle mandala. Dynamically imported with ssr:false from Hero.jsx,
// so this module only ever runs in the browser.

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { vertexShader, fragmentShader, GRADIENT_STOPS, MARIGOLD } from "./ribbonShader";

const MAX_TILT = (6 * Math.PI) / 180; // ±6° toward cursor
const TILT_LERP = 0.04;
const SCROLL_LERP = 0.08;
const RING_COUNT = 12;

function Rangoli({ count, radius, offset }) {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const scroll = useRef(0);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // position is required by THREE for draw count; real placement
    // happens in the vertex shader from aRing / aAngle.
    const position = new Float32Array(count * 3);
    const ring = new Float32Array(count);
    const angle = new Float32Array(count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // 12 concentric formations; equal share per ring keeps the
      // inner rings denser — a glowing rangoli core
      ring[i] = (i % RING_COUNT) / (RING_COUNT - 1);
      angle[i] = Math.random() * Math.PI * 2;
      seed[i] = Math.random();
    }
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("aRing", new THREE.BufferAttribute(ring, 1));
    geo.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 20);
    return geo;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointSize: { value: 5.5 },
      uRadius: { value: radius },
      uPointer: { value: new THREE.Vector2(100, 100) }, // far away until the pointer moves
      uColors: { value: GRADIENT_STOPS.map((s) => new THREE.Color(s.color)) },
      uStops: { value: GRADIENT_STOPS.map((s) => s.offset) },
      uMarigold: { value: new THREE.Color(MARIGOLD) },
    }),
    // radius is fixed per mount (env detected once)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const onPointerMove = (e) => {
      // NDC relative to the canvas element (it only spans part of the hero)
      const rect = gl.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.current.active = true;
    };
    // simple hero scroll progress — deliberately NOT ScrollTrigger
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / window.innerHeight);
    };
    onScroll();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const mat = materialRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts) return;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    mat.uniforms.uScroll.value +=
      (scroll.current - mat.uniforms.uScroll.value) * SCROLL_LERP;

    // pointer projected onto the z=0 world plane (camera looks down -z)
    if (pointer.current.active) {
      mat.uniforms.uPointer.value.set(
        (pointer.current.x * state.viewport.width) / 2,
        (-pointer.current.y * state.viewport.height) / 2
      );
    }

    // the mandala tilts ±6° toward the cursor (lerped; NDC is
    // canvas-relative so it can exceed ±1 — clamp for the tilt)
    const targetY = Math.max(-1, Math.min(1, pointer.current.x)) * MAX_TILT;
    const targetX = Math.max(-1, Math.min(1, pointer.current.y)) * MAX_TILT;
    pts.rotation.y += (targetY - pts.rotation.y) * TILT_LERP;
    pts.rotation.x += (targetX - pts.rotation.x) * TILT_LERP;
  });

  return (
    // outer group holds the static pose; inner points carries the mouse tilt
    <group rotation={[0.16, -0.12, 0]} position={offset}>
      <points ref={pointsRef} frustumCulled={false}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

// Static CSS mandala suggestion for no-WebGL / reduced-motion users:
// concentric ring gradients in the brand spectrum, right-weighted.
function RibbonFallback() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-14%",
          width: "min(78vmin, 720px)",
          height: "min(78vmin, 720px)",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          background: [
            // fine kolam rings
            "repeating-radial-gradient(circle at 50% 50%, transparent 0 24px, color-mix(in srgb, var(--rani) 22%, transparent) 24px 26px, transparent 26px 52px, color-mix(in srgb, var(--teal) 18%, transparent) 52px 54px)",
            // warm-to-cool radial wash through the brand spectrum
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--saffron) 38%, transparent), color-mix(in srgb, var(--vermilion) 30%, transparent) 26%, color-mix(in srgb, var(--rani) 24%, transparent) 50%, color-mix(in srgb, var(--violet) 18%, transparent) 72%, color-mix(in srgb, var(--teal) 14%, transparent) 88%, transparent 100%)",
          ].join(", "),
          opacity: 0.85,
        }}
      />
    </div>
  );
}

function detectEnvironment() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    webgl = false;
  }
  const mobile = window.innerWidth < 768;
  return {
    ok: webgl && !reducedMotion,
    // halve particle count below 768px (checked once on mount)
    count: mobile ? 12000 : 24000,
    // large + right-weighted on desktop (edge-clipped feels intentional);
    // centered behind the type on mobile
    radius: mobile ? 2.6 : 3.6,
    offset: mobile ? [0, 0.4, 0] : [1.15, 0.1, 0],
  };
}

export default function RibbonCanvas() {
  // lazy initializer = "once on mount"; module is client-only (ssr:false)
  const [env] = useState(detectEnvironment);

  if (!env.ok) return <RibbonFallback />;

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Canvas
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 35, position: [0, 0, 11], near: 0.1, far: 60 }}
        dpr={[1, 1.75]}
        frameloop="always"
        style={{ background: "transparent" }}
      >
        <Rangoli count={env.count} radius={env.radius} offset={env.offset} />
      </Canvas>
    </div>
  );
}
