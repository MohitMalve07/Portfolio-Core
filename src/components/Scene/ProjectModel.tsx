import { useEffect, useMemo, useRef, useState } from 'react';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ProjectId, ProjectInfo } from '../../data/projects';

interface ProjectModelProps {
  project: ProjectInfo;
  geometry: THREE.BufferGeometry;
  baseMaterial: THREE.Material;
  isInteractive: boolean;
  isSelected: boolean;
  onSelect: (id: ProjectId) => void;
}

/**
 * Reusable collectible 3D project model placed on the workstation desk.
 * Preserves the original GLB material/textures while supporting independent
 * pointer raycasting, hover sheen, and selected highlight emphasis.
 */
export function ProjectModel({
  project,
  geometry,
  baseMaterial,
  isInteractive,
  isSelected,
  onSelect,
}: ProjectModelProps) {
  const [isHovered, setIsHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    const cloned = baseMaterial.clone();
    if (cloned instanceof THREE.MeshStandardMaterial) {
      cloned.emissive = new THREE.Color('#ffbd4a');
      cloned.emissiveIntensity = 0;
    }
    return cloned;
  }, [baseMaterial]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useEffect(() => {
    if (!isInteractive) {
      setIsHovered(false);
      document.body.style.cursor = 'auto';
    }
  }, [isInteractive]);

  useFrame(({ clock }) => {
    if (material instanceof THREE.MeshStandardMaterial) {
      let targetEmissive = 0;
      if (isInteractive) {
        if (isSelected) {
          targetEmissive = 0.24 + Math.sin(clock.getElapsedTime() * 3.2) * 0.05;
        } else if (isHovered) {
          targetEmissive = 0.14;
        }
      }
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        targetEmissive,
        0.18,
      );
    }

    if (groupRef.current) {
      const targetScale =
        isInteractive && isSelected
          ? project.scale * 1.07
          : isInteractive && isHovered
            ? project.scale * 1.04
            : project.scale;
      const cur = groupRef.current.scale.x;
      const next = THREE.MathUtils.lerp(cur, targetScale, 0.18);
      groupRef.current.scale.setScalar(next);
    }

    if (ringRef.current && isInteractive && (isSelected || isHovered)) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 3.0) * 0.04;
      ringRef.current.scale.set(s, s, 1);
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!isInteractive) return;
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (!isInteractive) return;
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isInteractive) return;
    e.stopPropagation();
    onSelect(project.id);
  };

  return (
    <group position={project.position}>
      <group
        ref={groupRef}
        name={project.objectName}
        rotation={[0, project.rotationY, 0]}
        scale={project.scale}
      >
        <mesh
          name={`${project.objectName}_Mesh`}
          geometry={geometry}
          material={material}
          castShadow
          receiveShadow
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        />
      </group>

      {isInteractive && (isSelected || isHovered) && (
        <mesh
          ref={ringRef}
          position={[0, 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.068, 0.084, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#ffd36b' : '#ffe6a8'}
            transparent
            opacity={isSelected ? 0.88 : 0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
