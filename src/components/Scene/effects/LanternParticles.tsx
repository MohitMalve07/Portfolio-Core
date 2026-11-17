import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createParticleShaderMaterial,
  disableParticleRaycast,
} from './particleShader';

interface LanternParticlesProps {
  /** World-space center of the glowing lantern glass */
  center: [number, number, number];
  radius?: number;
  count?: number;
  isTabVisibleRef: React.RefObject<boolean>;
  densityScale: number;
}

/**
 * Low-density golden firefly particles gently orbiting and bobbing around
 * an individual workshop lantern.
 */
export function LanternParticles({
  center,
  radius = 0.18,
  count = 14,
  isTabVisibleRef,
  densityScale,
}: LanternParticlesProps) {
  const actualCount = Math.max(7, Math.round(count * densityScale));

  const { geometry, material, state } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3);
    const colors = new Float32Array(actualCount * 3);
    const sizes = new Float32Array(actualCount);
    const alphas = new Float32Array(actualCount);

    const angles = new Float32Array(actualCount);
    const radii = new Float32Array(actualCount);
    const angularSpeeds = new Float32Array(actualCount);
    const yOffsets = new Float32Array(actualCount);
    const bobSpeeds = new Float32Array(actualCount);
    const phases = new Float32Array(actualCount);
    const baseAlphas = new Float32Array(actualCount);

    const warmGold = new THREE.Color('#ffd06b');
    const softAmber = new THREE.Color('#ffaa3b');

    for (let i = 0; i < actualCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = radius * (0.68 + Math.random() * 0.65);
      angularSpeeds[i] =
        (Math.random() < 0.5 ? 1 : -1) * (0.25 + Math.random() * 0.35);
      yOffsets[i] = (Math.random() - 0.35) * 0.28;
      bobSpeeds[i] = 0.7 + Math.random() * 0.8;
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.011 + Math.random() * 0.008;
      baseAlphas[i] = 0.34 + Math.random() * 0.32;
      alphas[i] = baseAlphas[i];

      const c = Math.random() < 0.65 ? warmGold : softAmber;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      positions[i * 3] = center[0] + Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = center[1] + yOffsets[i];
      positions[i * 3 + 2] = center[2] + Math.sin(angles[i]) * radii[i];
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    const mat = createParticleShaderMaterial({
      blending: THREE.AdditiveBlending,
      nearFadeDistance: 0.3,
      maxPointSize: 18,
      softness: 2.3,
    });

    return {
      geometry: geom,
      material: mat,
      state: {
        positions,
        alphas,
        angles,
        radii,
        angularSpeeds,
        yOffsets,
        bobSpeeds,
        phases,
        baseAlphas,
      },
    };
  }, [actualCount, center, radius]);

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
    const {
      positions,
      alphas,
      angles,
      radii,
      angularSpeeds,
      yOffsets,
      bobSpeeds,
      phases,
      baseAlphas,
    } = state;

    for (let i = 0; i < actualCount; i++) {
      angles[i] += angularSpeeds[i] * dt;
      const r = radii[i] + Math.sin(t * 0.9 + phases[i]) * 0.025;
      const idx = i * 3;

      positions[idx] = center[0] + Math.cos(angles[i]) * r;
      positions[idx + 1] =
        center[1] + yOffsets[i] + Math.sin(t * bobSpeeds[i] + phases[i]) * 0.055;
      positions[idx + 2] = center[2] + Math.sin(angles[i]) * r;

      const shimmer = 0.65 + 0.35 * Math.sin(t * 2.4 + phases[i] * 2.0);
      alphas[i] = baseAlphas[i] * shimmer;
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
