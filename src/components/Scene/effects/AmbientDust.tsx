import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createParticleShaderMaterial,
  disableParticleRaycast,
} from './particleShader';

interface AmbientDustProps {
  isTabVisibleRef: React.RefObject<boolean>;
  densityScale: number;
}

// Cabin interior bounds from GLB walls/floor/rafters
const CABIN_MIN: [number, number, number] = [-2.85, 0.25, -0.3];
const CABIN_MAX: [number, number, number] = [2.25, 2.65, 3.4];

// Key warm light sources where ambient dust catches slightly stronger illumination
const LIGHT_POOLS: [number, number, number, number][] = [
  [-1.64, 0.82, -0.1, 1.45], // Fireplace hearth
  [-1.17, 1.65, 0.0, 0.95], // Mantel lantern
  [0.46, 1.92, -0.23, 1.15], // Desk cat lamp
  [1.08, 1.35, 0.1, 1.35], // Workstation desk
  [2.115, 0.28, 1.722, 1.05], // Floor lantern
];

function computeLightVisibility(x: number, y: number, z: number): number {
  let boost = 0;
  for (let p = 0; p < LIGHT_POOLS.length; p++) {
    const [lx, ly, lz, radius] = LIGHT_POOLS[p];
    const dx = x - lx;
    const dy = y - ly;
    const dz = z - lz;
    const d2 = dx * dx + dy * dy + dz * dz;
    const r2 = radius * radius;
    if (d2 < r2) {
      boost = Math.max(boost, 1 - d2 / r2);
    }
  }
  return 0.11 + boost * 0.24;
}

/**
 * Low-density ambient floating dust motes across the cabin interior.
 * Subtle in shadowed regions and softly illuminated near warm lights.
 */
export function AmbientDust({
  isTabVisibleRef,
  densityScale,
}: AmbientDustProps) {
  const count = Math.max(40, Math.round(96 * densityScale));

  const { geometry, material, state } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    const driftX = new Float32Array(count);
    const driftY = new Float32Array(count);
    const driftZ = new Float32Array(count);
    const phases = new Float32Array(count);

    const ivory = new THREE.Color('#f7e8cb');
    const mutedGold = new THREE.Color('#e6c27a');

    for (let i = 0; i < count; i++) {
      const x =
        CABIN_MIN[0] + Math.random() * (CABIN_MAX[0] - CABIN_MIN[0]);
      const y =
        CABIN_MIN[1] + Math.random() * (CABIN_MAX[1] - CABIN_MIN[1]);
      const z =
        CABIN_MIN[2] + Math.random() * (CABIN_MAX[2] - CABIN_MIN[2]);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      driftX[i] = (Math.random() - 0.5) * 0.032;
      driftY[i] = (Math.random() - 0.35) * 0.024;
      driftZ[i] = (Math.random() - 0.5) * 0.032;
      phases[i] = Math.random() * Math.PI * 2;

      sizes[i] = 0.011 + Math.random() * 0.012;
      alphas[i] = computeLightVisibility(x, y, z);

      const c = Math.random() < 0.6 ? ivory : mutedGold;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    const mat = createParticleShaderMaterial({
      blending: THREE.NormalBlending,
      nearFadeDistance: 0.65,
      maxPointSize: 14,
      softness: 2.6,
    });

    return {
      geometry: geom,
      material: mat,
      state: { positions, alphas, driftX, driftY, driftZ, phases },
    };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }, rawDelta) => {
    if (!isTabVisibleRef.current) return;
    const dt = Math.min(rawDelta, 0.05);
    const t = clock.getElapsedTime();
    const { positions, alphas, driftX, driftY, driftZ, phases } = state;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const p = phases[i];

      let x =
        positions[idx] + (driftX[i] + Math.sin(t * 0.4 + p) * 0.015) * dt;
      let y =
        positions[idx + 1] + (driftY[i] + Math.cos(t * 0.35 + p) * 0.01) * dt;
      let z =
        positions[idx + 2] + (driftZ[i] + Math.sin(t * 0.3 + p * 1.3) * 0.015) * dt;

      // Wrap seamlessly inside cabin bounds
      if (x < CABIN_MIN[0]) x = CABIN_MAX[0];
      else if (x > CABIN_MAX[0]) x = CABIN_MIN[0];
      if (y < CABIN_MIN[1]) y = CABIN_MAX[1];
      else if (y > CABIN_MAX[1]) y = CABIN_MIN[1];
      if (z < CABIN_MIN[2]) z = CABIN_MAX[2];
      else if (z > CABIN_MAX[2]) z = CABIN_MIN[2];

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      const shimmer = 0.78 + 0.22 * Math.sin(t * 0.9 + p);
      alphas[i] = computeLightVisibility(x, y, z) * shimmer;
    }

    (geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points
      geometry={geometry}
      material={material}
      raycast={disableParticleRaycast}
      frustumCulled={false}
    />
  );
}
