import { useEffect, useMemo, useRef, useState } from 'react';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getTrophyById,
  TROPHY_ACHIEVEMENTS,
  type TrophyId,
} from '../../data/achievements';

interface TrophyShelfProps {
  isActive: boolean;
  selectedTrophyId: TrophyId | null;
  onSelectTrophy: (id: TrophyId) => void;
}

const patchedTrophyMaterials = new WeakSet<THREE.Material>();

interface TrophyHighlightUniforms {
  uHoverBounds: { value: THREE.Vector4 }; // zMin, zMax, yMin, active
  uSelectBounds: { value: THREE.Vector4 }; // zMin, zMax, yMin, active
  uPulseTime: { value: number };
}

function attachTrophyHighlightShader(
  material: THREE.MeshStandardMaterial,
  uniforms: TrophyHighlightUniforms,
) {
  if (patchedTrophyMaterials.has(material)) return;
  patchedTrophyMaterials.add(material);

  material.customProgramCacheKey = () => 'trophy-shelf-highlight-v1';
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uHoverBounds = uniforms.uHoverBounds;
    shader.uniforms.uSelectBounds = uniforms.uSelectBounds;
    shader.uniforms.uPulseTime = uniforms.uPulseTime;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vTrophyWorldPos;',
      )
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
        vTrophyWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vTrophyWorldPos;
        uniform vec4 uHoverBounds;
        uniform vec4 uSelectBounds;
        uniform float uPulseTime;

        float inTrophyRange(vec3 pos, vec4 bounds) {
          if (bounds.w < 0.5) return 0.0;
          float inY = smoothstep(bounds.z - 0.004, bounds.z + 0.006, pos.y);
          float inZ = smoothstep(bounds.x - 0.006, bounds.x + 0.004, pos.z) *
                      (1.0 - smoothstep(bounds.y - 0.004, bounds.y + 0.006, pos.z));
          return inY * inZ;
        }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          float hoverMask = inTrophyRange(vTrophyWorldPos, uHoverBounds);
          float selectMask = inTrophyRange(vTrophyWorldPos, uSelectBounds);
          float pulse = 0.85 + 0.15 * sin(uPulseTime * 3.2);
          totalEmissiveRadiance += vec3(1.0, 0.72, 0.25) * hoverMask * 0.38;
          totalEmissiveRadiance += vec3(1.0, 0.74, 0.22) * selectMask * 0.75 * pulse;
        }`,
      );
  };
  material.needsUpdate = true;
}

/**
 * Interactive overlay for the GLB's Trophy_Shelf_Collection mesh.
 * Maps each of the 4 upper-shelf trophies to raycastable bounds and applies
 * world-space shader emphasis + subtle golden pedestal ring feedback.
 */
export function TrophyShelf({
  isActive,
  selectedTrophyId,
  onSelectTrophy,
}: TrophyShelfProps) {
  const { scene } = useThree();
  const [hoveredTrophyId, setHoveredTrophyId] = useState<TrophyId | null>(null);

  const shaderUniforms = useMemo<TrophyHighlightUniforms>(
    () => ({
      uHoverBounds: { value: new THREE.Vector4(0, 0, 2.125, 0) },
      uSelectBounds: { value: new THREE.Vector4(0, 0, 2.125, 0) },
      uPulseTime: { value: 0 },
    }),
    [],
  );

  // Locate actual GLB Trophy_Shelf_Collection mesh and attach highlight uniforms once
  useEffect(() => {
    const shelfObj = scene.getObjectByName('Trophy_Shelf_Collection');
    if (!shelfObj) return;

    shelfObj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        for (const mat of materials) {
          if (mat instanceof THREE.MeshStandardMaterial) {
            attachTrophyHighlightShader(mat, shaderUniforms);
          }
        }
      }
    });
  }, [scene, shaderUniforms]);

  // Clear hover & pointer cursor when leaving Experience mode
  useEffect(() => {
    if (!isActive) {
      setHoveredTrophyId(null);
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isActive]);

  // Update shader uniform bounds whenever hover/selection/active state changes
  useEffect(() => {
    const hovered = isActive ? getTrophyById(hoveredTrophyId) : null;
    const selected = isActive ? getTrophyById(selectedTrophyId) : null;

    if (hovered && hovered.id !== selected?.id) {
      shaderUniforms.uHoverBounds.value.set(
        hovered.bounds.zMin,
        hovered.bounds.zMax,
        hovered.bounds.yMin,
        1,
      );
    } else {
      shaderUniforms.uHoverBounds.value.set(0, 0, 2.125, 0);
    }

    if (selected) {
      shaderUniforms.uSelectBounds.value.set(
        selected.bounds.zMin,
        selected.bounds.zMax,
        selected.bounds.yMin,
        1,
      );
    } else {
      shaderUniforms.uSelectBounds.value.set(0, 0, 2.125, 0);
    }
  }, [isActive, hoveredTrophyId, selectedTrophyId, shaderUniforms]);

  const activeRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!isActive) return;
    const t = clock.getElapsedTime();
    shaderUniforms.uPulseTime.value = t;
    if (activeRingRef.current) {
      const s = 1 + Math.sin(t * 3.0) * 0.05;
      activeRingRef.current.scale.set(s, s, 1);
    }
  });

  if (!isActive) return null;

  const selectedTrophy = getTrophyById(selectedTrophyId);
  const hoveredTrophy = getTrophyById(hoveredTrophyId);
  const emphasizedTrophy = selectedTrophy ?? hoveredTrophy;

  const handlePointerOver = (id: TrophyId) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredTrophyId(id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (id: TrophyId) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredTrophyId((prev) => (prev === id ? null : prev));
    document.body.style.cursor = 'auto';
  };

  const handleClick = (id: TrophyId) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectTrophy(id);
  };

  return (
    <group name="TrophyShelf_InteractiveOverlay">
      {/* Raycastable hit volumes aligned to each trophy's exact GLB world bounds */}
      {TROPHY_ACHIEVEMENTS.map((trophy) => (
        <mesh
          key={trophy.id}
          name={`TrophyHitbox_${trophy.id}`}
          position={trophy.center}
          onPointerOver={handlePointerOver(trophy.id)}
          onPointerOut={handlePointerOut(trophy.id)}
          onClick={handleClick(trophy.id)}
        >
          <boxGeometry args={trophy.size} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      {/* Subtle golden pedestal ring + warm accent glow for hovered/selected trophy */}
      {emphasizedTrophy && (
        <>
          <mesh
            ref={activeRingRef}
            position={[
              emphasizedTrophy.center[0],
              emphasizedTrophy.bounds.yMin + 0.004,
              emphasizedTrophy.center[2],
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.072, 0.092, 32]} />
            <meshBasicMaterial
              color={selectedTrophy ? '#ffd36b' : '#ffe4a3'}
              transparent
              opacity={selectedTrophy ? 0.85 : 0.55}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <pointLight
            position={[
              emphasizedTrophy.center[0] - 0.25,
              emphasizedTrophy.center[1] + 0.06,
              emphasizedTrophy.center[2],
            ]}
            color="#ffcf75"
            intensity={selectedTrophy ? 0.55 : 0.3}
            distance={1.2}
            decay={2}
          />
        </>
      )}
    </group>
  );
}
