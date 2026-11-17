import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

let rectAreaInitialized = false;

/** Converts Blender's linear RGB light color to a Three.js Color accurately. */
function blenderColor(r: number, g: number, b: number): THREE.Color {
  return new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);
}

/**
 * Recreates the lighting rig from AdventureWorkshop_Lighting_Polish.blend
 * using physically scaled Three.js intensities (Watts -> cd / nits) and
 * exact Blender linear light colors without duplicated light sources.
 */
export function WorkshopLights() {
  const mainSpotTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const windowSpotTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const exteriorTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  const firePointRef = useRef<THREE.PointLight>(null);
  const rectSoftFillRef = useRef<THREE.RectAreaLight>(null);
  const rectLeftFillRef = useRef<THREE.RectAreaLight>(null);
  const rectShelfRef = useRef<THREE.RectAreaLight>(null);
  const rectMonitorRef = useRef<THREE.RectAreaLight>(null);
  const rectFireSpillRef = useRef<THREE.RectAreaLight>(null);

  useFrame(({ clock }) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const t = clock.getElapsedTime();
    const flicker =
      Math.sin(t * 7.1) * 0.045 +
      Math.sin(t * 13.3) * 0.03 +
      Math.sin(t * 21.7) * 0.015;
    if (firePointRef.current) {
      firePointRef.current.intensity = 5.1 * (1 + flicker);
    }
    if (rectFireSpillRef.current) {
      rectFireSpillRef.current.intensity = 1.9 * (1 + flicker * 0.7);
    }
  });

  const colors = useMemo(
    () => ({
      hemiSky: blenderColor(0.55, 0.65, 0.85),
      hemiGround: blenderColor(0.18, 0.11, 0.07),
      mainWarmKey: blenderColor(1.0, 0.78, 0.54),
      cabinSoftFill: blenderColor(1.0, 0.84, 0.66),
      leftAmbientFill: blenderColor(1.0, 0.82, 0.62),
      shelfAccent: blenderColor(1.0, 0.82, 0.58),
      windowCoolDaylight: blenderColor(0.68, 0.83, 1.0),
      exteriorSkyFill: blenderColor(0.58, 0.74, 1.0),
      fireMain: blenderColor(1.0, 0.38, 0.06),
      fireSpill: blenderColor(1.0, 0.36, 0.05),
      catLamp: blenderColor(1.0, 0.68, 0.2),
      lantern: blenderColor(1.0, 0.58, 0.14),
      stringLight: blenderColor(1.0, 0.7, 0.24),
      monitorGlow: blenderColor(0.76, 0.86, 1.0),
    }),
    [],
  );

  useEffect(() => {
    if (!rectAreaInitialized) {
      RectAreaLightUniformsLib.init();
      rectAreaInitialized = true;
    }

    mainSpotTargetRef.current.position.set(1.07, 0.95, 0.25);
    windowSpotTargetRef.current.position.set(0.95, 0.9, 0.95);
    exteriorTargetRef.current.position.set(5.3, 0.6, -1.0);

    // Orient RectAreaLights along their exact Blender forward vectors
    rectSoftFillRef.current?.lookAt(-0.48, 1.72, 2.56);
    rectLeftFillRef.current?.lookAt(-1.22, 1.8, 1.46);
    rectShelfRef.current?.lookAt(0.89, 1.87, 0.12);
    rectMonitorRef.current?.lookAt(0.95, 0.73, 0.84);
    rectFireSpillRef.current?.lookAt(-0.74, 0.16, 1.75);
  }, []);

  return (
    <>
      {/* Minimal twilight sky / warm cabin bounce without washing out shadows */}
      <hemisphereLight
        color={colors.hemiSky}
        groundColor={colors.hemiGround}
        intensity={0.14}
      />

      {/* Light targets */}
      <primitive object={mainSpotTargetRef.current} />
      <primitive object={windowSpotTargetRef.current} />
      <primitive object={exteriorTargetRef.current} />

      {/* Main Warm Key Area (48W) — single shadow-casting source */}
      <spotLight
        position={[1.05, 2.62, 1.55]}
        target={mainSpotTargetRef.current}
        color={colors.mainWarmKey}
        intensity={7.6}
        angle={1.22}
        penumbra={0.95}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Cabin Soft Fill Area (16W / (pi * A)) */}
      <rectAreaLight
        ref={rectSoftFillRef}
        position={[-0.45, 1.88, 3.55]}
        width={4.5}
        height={2.8}
        color={colors.cabinSoftFill}
        intensity={0.32}
      />

      {/* Left Wall Ambient Fill Area (12W / (pi * A)) */}
      <rectAreaLight
        ref={rectLeftFillRef}
        position={[-0.65, 2.05, 2.25]}
        width={3.2}
        height={2.2}
        color={colors.leftAmbientFill}
        intensity={0.45}
      />

      {/* Workstation Shelf Accent Area (22W / (pi * A)) */}
      <rectAreaLight
        ref={rectShelfRef}
        position={[0.65, 2.35, 2.05]}
        width={2.6}
        height={1.6}
        color={colors.shelfAccent}
        intensity={1.1}
      />

      {/* Window Cool Daylight (125W) — single shadow-casting beam into cabin */}
      <spotLight
        position={[3.35, 1.82, 1.32]}
        target={windowSpotTargetRef.current}
        color={colors.windowCoolDaylight}
        intensity={19.5}
        angle={0.95}
        penumbra={0.8}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Exterior Sky Fill (95W) illuminating snowy pine trees outside the window */}
      <spotLight
        position={[5.2, 3.0, -1.8]}
        target={exteriorTargetRef.current}
        color={colors.exteriorSkyFill}
        intensity={14}
        angle={1.35}
        penumbra={0.9}
        decay={2}
      />

      {/* Fireplace Main Point (64.19W / 4pi = 5.1) + soft hearth spill (22W) */}
      <pointLight
        ref={firePointRef}
        position={[-1.64, 0.78, 0.04]}
        color={colors.fireMain}
        intensity={5.1}
        distance={6.0}
        decay={2}
      />
      <rectAreaLight
        ref={rectFireSpillRef}
        position={[-1.64, 0.72, 0.06]}
        width={1.1}
        height={1.1}
        color={colors.fireSpill}
        intensity={1.9}
      />

      {/* Practical Point Lights (Blender Watts / 4pi) */}
      <pointLight
        position={[0.46, 1.92, -0.2]}
        color={colors.catLamp}
        intensity={1.15}
        distance={3.5}
        decay={2}
      />
      <pointLight
        position={[-1.17, 1.6, 0]}
        color={colors.lantern}
        intensity={1.15}
        distance={3.5}
        decay={2}
      />
      <pointLight
        position={[2.12, 0.22, 1.72]}
        color={colors.lantern}
        intensity={1.3}
        distance={4.0}
        decay={2}
      />
      <pointLight
        position={[0.25, 2.8, 1.05]}
        color={colors.stringLight}
        intensity={0.9}
        distance={4.0}
        decay={2}
      />
      <pointLight
        position={[1.45, 2.71, 0.75]}
        color={colors.stringLight}
        intensity={0.9}
        distance={4.0}
        decay={2}
      />

      {/* Monitor Screen Subtle Cool Glow (5.5W) */}
      <rectAreaLight
        ref={rectMonitorRef}
        position={[0.95, 1.24, -0.02]}
        width={0.75}
        height={0.35}
        color={colors.monitorGlow}
        intensity={1.1}
      />
    </>
  );
}
