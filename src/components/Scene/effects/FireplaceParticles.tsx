import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createParticleShaderMaterial,
  disableParticleRaycast,
} from './particleShader';

interface FireplaceParticlesProps {
  isTabVisibleRef: React.RefObject<boolean>;
  densityScale: number;
}

// Derived from Cabin_Stone_Fireplace flame bounds:
// x in [-1.962, -1.318], y in [0.504, 1.103], z in [-0.486, -0.086]
const FLAME_ORIGIN: [number, number, number] = [-1.58, 0.5, -0.02];

const EMBER_PALETTE = [
  new THREE.Color('#ff5e14'),
  new THREE.Color('#ff8a1f'),
  new THREE.Color('#ffb833'),
  new THREE.Color('#ffe066'),
];

interface EmberData {
  ages: Float32Array;
  lifetimes: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  vz: Float32Array;
  baseSizes: Float32Array;
  baseAlphas: Float32Array;
  phases: Float32Array;
  isSpark: Uint8Array;
}

function resetEmber(
  i: number,
  positions: Float32Array,
  colors: Float32Array,
  data: EmberData,
  randomAge = false,
) {
  const spark = Math.random() < 0.25 ? 1 : 0;
  data.isSpark[i] = spark;

  const life = spark ? 1.15 + Math.random() * 0.95 : 1.9 + Math.random() * 1.4;
  data.lifetimes[i] = life;
  data.ages[i] = randomAge ? Math.random() * life : 0;

  // Spawn around firebox logs and hearth opening
  const x = FLAME_ORIGIN[0] + (Math.random() - 0.5) * 0.52;
  const y = FLAME_ORIGIN[1] + Math.random() * 0.24;
  const z = FLAME_ORIGIN[2] + (Math.random() - 0.3) * 0.34;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  data.vx[i] = (Math.random() - 0.38) * (spark ? 0.18 : 0.11);
  data.vy[i] = spark ? 0.46 + Math.random() * 0.34 : 0.21 + Math.random() * 0.21;
  data.vz[i] = (Math.random() - 0.25) * (spark ? 0.15 : 0.09);

  data.baseSizes[i] = spark
    ? 0.036 + Math.random() * 0.024
    : 0.048 + Math.random() * 0.036;
  data.baseAlphas[i] = spark
    ? 0.85 + Math.random() * 0.15
    : 0.72 + Math.random() * 0.26;
  data.phases[i] = Math.random() * Math.PI * 2;

  const col = spark
    ? EMBER_PALETTE[2 + Math.floor(Math.random() * 2)]
    : EMBER_PALETTE[Math.floor(Math.random() * 3)];
  colors[i * 3] = col.r;
  colors[i * 3 + 1] = col.g;
  colors[i * 3 + 2] = col.b;
}

/**
 * Localized embers and faster bright sparks rising naturally from the
 * fireplace firebox using fixed pre-allocated particle buffers.
 */
export function FireplaceParticles({
  isTabVisibleRef,
  densityScale,
}: FireplaceParticlesProps) {
  const count = Math.max(36, Math.round(84 * densityScale));
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material, state } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    const data: EmberData = {
      ages: new Float32Array(count),
      lifetimes: new Float32Array(count),
      vx: new Float32Array(count),
      vy: new Float32Array(count),
      vz: new Float32Array(count),
      baseSizes: new Float32Array(count),
      baseAlphas: new Float32Array(count),
      phases: new Float32Array(count),
      isSpark: new Uint8Array(count),
    };

    for (let i = 0; i < count; i++) {
      resetEmber(i, positions, colors, data, true);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    const mat = createParticleShaderMaterial({
      blending: THREE.AdditiveBlending,
      nearFadeDistance: 0.35,
      maxPointSize: 48,
      softness: 1.55,
    });

    return {
      geometry: geom,
      material: mat,
      state: { positions, colors, sizes, alphas, data },
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
    const { positions, colors, sizes, alphas, data } = state;

    for (let i = 0; i < count; i++) {
      data.ages[i] += dt;
      if (data.ages[i] >= data.lifetimes[i]) {
        resetEmber(i, positions, colors, data, false);
      }

      const lifeRatio = data.ages[i] / data.lifetimes[i];
      const sway = Math.sin(t * 2.6 + data.phases[i]) * 0.05;
      const idx = i * 3;

      positions[idx] += (data.vx[i] + sway) * dt;
      positions[idx + 1] += data.vy[i] * dt;
      positions[idx + 2] += data.vz[i] * dt;

      // Fade in quickly, shrink and fade smoothly before chimney height
      const fadeIn = Math.min(1, lifeRatio / 0.14);
      const fadeOut = Math.pow(Math.max(0, 1 - lifeRatio), 1.35);
      const flicker = 0.78 + 0.22 * Math.sin(t * 11.0 + data.phases[i]);

      sizes[i] = data.baseSizes[i] * (1 - lifeRatio * 0.55);
      alphas[i] = data.baseAlphas[i] * fadeIn * fadeOut * flicker;
    }

    (geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      raycast={disableParticleRaycast}
      frustumCulled={false}
    />
  );
}
