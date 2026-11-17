import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createParticleShaderMaterial,
  disableParticleRaycast,
} from './particleShader';

interface DeskCharacterParticlesProps {
  isTabVisibleRef: React.RefObject<boolean>;
  densityScale: number;
}

// Derived from Desk_Cat_Lamp in AdventureWorkshop_Lighting_Polish.glb:
// center = [0.46, 1.924, -0.23], bounds half-size = [0.115, 0.120, 0.115]
const CAT_LAMP_CENTER: [number, number, number] = [0.46, 1.924, -0.23];

/**
 * Magical golden and warm-white sparkles orbiting Desk_Cat_Lamp with
 * occasional rising motes, gentle sparkle bursts, and subtle pulsing aura.
 */
export function DeskCharacterParticles({
  isTabVisibleRef,
  densityScale,
}: DeskCharacterParticlesProps) {
  const count = Math.max(12, Math.round(24 * densityScale));
  const auraLightRef = useRef<THREE.PointLight>(null);

  const { geometry, material, state } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    const modes = new Uint8Array(count); // 0 = orbiting, 1 = rising sparkle
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);
    const yBase = new Float32Array(count);
    const ages = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    const phases = new Float32Array(count);
    const baseSizes = new Float32Array(count);

    const gold = new THREE.Color('#ffd873');
    const warmWhite = new THREE.Color('#fff5d6');

    for (let i = 0; i < count; i++) {
      const isRising = i < Math.max(4, Math.round(count * 0.28)) ? 1 : 0;
      modes[i] = isRising;
      angles[i] = Math.random() * Math.PI * 2;
      // Keep strictly outside the cat lamp's 0.115m radius so its face stays clear
      radii[i] = isRising
        ? 0.08 + Math.random() * 0.11
        : 0.145 + Math.random() * 0.085;
      speeds[i] =
        (Math.random() < 0.5 ? 1 : -1) * (0.45 + Math.random() * 0.45);
      yBase[i] = isRising ? -0.02 : (Math.random() - 0.5) * 0.22;
      lifetimes[i] = 1.8 + Math.random() * 1.4;
      ages[i] = Math.random() * lifetimes[i];
      phases[i] = Math.random() * Math.PI * 2;
      baseSizes[i] = 0.01 + Math.random() * 0.009;
      sizes[i] = baseSizes[i];
      alphas[i] = 0.55;

      const c = Math.random() < 0.58 ? gold : warmWhite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      positions[i * 3] = CAT_LAMP_CENTER[0] + Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = CAT_LAMP_CENTER[1] + yBase[i];
      positions[i * 3 + 2] = CAT_LAMP_CENTER[2] + Math.sin(angles[i]) * radii[i];
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    const mat = createParticleShaderMaterial({
      blending: THREE.AdditiveBlending,
      nearFadeDistance: 0.3,
      maxPointSize: 20,
      softness: 2.1,
    });

    return {
      geometry: geom,
      material: mat,
      state: {
        positions,
        sizes,
        alphas,
        modes,
        angles,
        radii,
        speeds,
        yBase,
        ages,
        lifetimes,
        phases,
        baseSizes,
      },
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

    // Subtle periodic sparkle burst envelope every ~5 seconds
    const burstCycle = Math.max(0, Math.sin(t * 1.25));
    const burstBoost = Math.pow(burstCycle, 6) * 0.45;

    if (auraLightRef.current) {
      auraLightRef.current.intensity =
        0.22 + Math.sin(t * 2.1) * 0.05 + burstBoost * 0.18;
    }

    const {
      positions,
      sizes,
      alphas,
      modes,
      angles,
      radii,
      speeds,
      yBase,
      ages,
      lifetimes,
      phases,
      baseSizes,
    } = state;

    for (let i = 0; i < count; i++) {
      angles[i] += speeds[i] * dt;
      const idx = i * 3;

      if (modes[i] === 1) {
        ages[i] += dt;
        if (ages[i] >= lifetimes[i]) {
          ages[i] = 0;
          angles[i] = Math.random() * Math.PI * 2;
          radii[i] = 0.08 + Math.random() * 0.11;
        }
        const p = ages[i] / lifetimes[i];
        const r = radii[i] + p * 0.06;
        positions[idx] = CAT_LAMP_CENTER[0] + Math.cos(angles[i]) * r;
        positions[idx + 1] = CAT_LAMP_CENTER[1] + yBase[i] + p * 0.3;
        positions[idx + 2] = CAT_LAMP_CENTER[2] + Math.sin(angles[i]) * r;

        const fade = Math.sin(p * Math.PI);
        sizes[i] = baseSizes[i] * (0.9 + 0.35 * fade + burstBoost * 0.5);
        alphas[i] = (0.45 + burstBoost) * fade;
      } else {
        const r = radii[i] + Math.sin(t * 1.3 + phases[i]) * 0.018;
        positions[idx] = CAT_LAMP_CENTER[0] + Math.cos(angles[i]) * r;
        positions[idx + 1] =
          CAT_LAMP_CENTER[1] + yBase[i] + Math.sin(t * 1.6 + phases[i]) * 0.04;
        positions[idx + 2] = CAT_LAMP_CENTER[2] + Math.sin(angles[i]) * r;

        const twinkle = Math.pow(0.5 + 0.5 * Math.sin(t * 3.4 + phases[i]), 2);
        sizes[i] = baseSizes[i] * (0.75 + 0.5 * twinkle + burstBoost * 0.5);
        alphas[i] = (0.35 + 0.45 * twinkle + burstBoost * 0.6) * 0.85;
      }
    }

    (geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <group>
      <points
        geometry={geometry}
        material={material}
        raycast={disableParticleRaycast}
        frustumCulled={false}
      />
      <pointLight
        ref={auraLightRef}
        position={[CAT_LAMP_CENTER[0], CAT_LAMP_CENTER[1] + 0.02, CAT_LAMP_CENTER[2] + 0.12]}
        color="#ffe29a"
        intensity={0.22}
        distance={0.95}
        decay={2}
      />
    </group>
  );
}
