import * as THREE from 'three';

export interface ParticleMaterialOptions {
  blending?: THREE.Blending;
  nearFadeDistance?: number;
  maxPointSize?: number;
  softness?: number;
}

/**
 * Lightweight analytic radial particle ShaderMaterial with per-particle
 * size, color, alpha, and smooth camera-proximity fade (zero textures needed).
 */
export function createParticleShaderMaterial({
  blending = THREE.AdditiveBlending,
  nearFadeDistance = 0.35,
  maxPointSize = 42,
  softness = 2.2,
}: ParticleMaterialOptions = {}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
      uNearFade: { value: nearFadeDistance },
      uMaxPointSize: { value: maxPointSize },
      uSoftness: { value: softness },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aAlpha;
      attribute vec3 aColor;

      uniform float uPixelRatio;
      uniform float uNearFade;
      uniform float uMaxPointSize;

      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float dist = max(0.05, -mvPosition.z);

        // Fade out gently before reaching the camera lens during close-ups
        float nearFactor = smoothstep(uNearFade * 0.45, uNearFade, dist);
        vAlpha = aAlpha * nearFactor;
        vColor = aColor;

        float pointSize = aSize * (320.0 / dist) * uPixelRatio;
        gl_PointSize = clamp(pointSize, 1.0, uMaxPointSize * uPixelRatio);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uSoftness;

      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float r = length(uv) * 2.0;
        if (r > 1.0) discard;

        float halo = pow(1.0 - r, uSoftness);
        float core = smoothstep(0.45, 0.0, r) * 0.45;
        float alpha = (halo + core) * vAlpha;
        if (alpha <= 0.002) discard;

        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending,
  });
}

/** Prevents R3F raycasting on decorative particle meshes. */
export const disableParticleRaycast = () => null;
