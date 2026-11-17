import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, useGLTF } from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  SKILL_CATEGORIES,
  SKILL_TREE_PLACEMENT,
  type SkillCategory,
  type SkillCategoryId,
} from '../../data/skills';

export const SKILL_TREE_MODEL_PATH = '/Models/Skill_Tree_optimized.glb';

interface SkillTreeModelProps {
  isInteractive: boolean;
  selectedCategoryId: SkillCategoryId | null;
  onSelectCategory: (id: SkillCategoryId) => void;
}

function findQuadrantForCenter(
  cx: number,
  cy: number,
  maxDim: number,
): SkillCategoryId | null {
  // Exclude large outer wood border frame and full-board pipes
  if (maxDim > 0.34) return null;
  for (const cat of SKILL_CATEGORIES) {
    const b = cat.quadrantBounds;
    if (cx >= b.xMin && cx <= b.xMax && cy >= b.yMin && cy <= b.yMax) {
      return cat.id;
    }
  }
  return null;
}

/**
 * Renders public/Models/Skill Tree.glb mounted on the right cabin wall above the bed,
 * overlaid with world-space 3D SDF labels and interactive quadrant highlights.
 */
export function SkillTreeModel({
  isInteractive,
  selectedCategoryId,
  onSelectCategory,
}: SkillTreeModelProps) {
  const { scene } = useGLTF(SKILL_TREE_MODEL_PATH);
  const { gl } = useThree();
  const [hoveredCategoryId, setHoveredCategoryId] =
    useState<SkillCategoryId | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const quadrantMaterials = useMemo(() => {
    const map: Record<SkillCategoryId, THREE.MeshStandardMaterial[]> = {
      programming: [],
      gamedev: [],
      multiplayer: [],
      'arvr-tools': [],
    };
    return map;
  }, []);

  useEffect(() => {
    const maxAnisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());

    // Clear buckets before populating
    for (const key of Object.keys(quadrantMaterials) as SkillCategoryId[]) {
      quadrantMaterials[key].length = 0;
    }

    scene.updateMatrixWorld(true);
    const box = new THREE.Box3();
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        // Compute mesh bounds in Skill Tree local space
        if (obj.geometry) {
          if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
          if (obj.geometry.boundingBox) {
            box.copy(obj.geometry.boundingBox);
            box.translate(obj.position);
            box.getSize(size);
            box.getCenter(center);
          }
        }

        const maxDim = Math.max(size.x, size.y, size.z);
        const quadrant = findQuadrantForCenter(center.x, center.y, maxDim);

        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of mats) {
          if (!(mat instanceof THREE.MeshStandardMaterial)) continue;
          if (mat.map) mat.map.anisotropy = maxAnisotropy;
          if (mat.normalMap) mat.normalMap.anisotropy = maxAnisotropy;
          if (mat.roughnessMap) mat.roughnessMap.anisotropy = maxAnisotropy;

          if (quadrant) {
            mat.emissive = new THREE.Color('#ffbd4a');
            mat.emissiveIntensity = 0;
            if (!quadrantMaterials[quadrant].includes(mat)) {
              quadrantMaterials[quadrant].push(mat);
            }
          }
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, gl, quadrantMaterials]);

  useEffect(() => {
    if (!isInteractive) {
      setHoveredCategoryId(null);
      setHoveredNodeId(null);
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isInteractive]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const cat of SKILL_CATEGORIES) {
      const isSelected = isInteractive && selectedCategoryId === cat.id;
      const isHovered = isInteractive && hoveredCategoryId === cat.id;
      const targetIntensity = isSelected
        ? 0.24 + Math.sin(t * 3.0) * 0.05
        : isHovered
          ? 0.13
          : 0;

      for (const mat of quadrantMaterials[cat.id]) {
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          targetIntensity,
          0.18,
        );
      }
    }
  });

  const handlePointerOver =
    (id: SkillCategoryId) => (e: ThreeEvent<PointerEvent>) => {
      if (!isInteractive) return;
      e.stopPropagation();
      setHoveredCategoryId(id);
      document.body.style.cursor = 'pointer';
    };

  const handlePointerOut =
    (id: SkillCategoryId) => (e: ThreeEvent<PointerEvent>) => {
      if (!isInteractive) return;
      e.stopPropagation();
      setHoveredCategoryId((prev) => (prev === id ? null : prev));
      document.body.style.cursor = 'auto';
    };

  const handleClick = (id: SkillCategoryId) => (e: ThreeEvent<MouseEvent>) => {
    if (!isInteractive) return;
    e.stopPropagation();
    onSelectCategory(id);
  };

  const activeAccentCategory: SkillCategory | undefined =
    SKILL_CATEGORIES.find(
      (c) => c.id === (selectedCategoryId ?? hoveredCategoryId),
    );

  const groupRef = useRef<THREE.Group>(null);

  return (
    <group
      ref={groupRef}
      name="SkillTree_WallMount"
      position={SKILL_TREE_PLACEMENT.position}
      rotation={[0, SKILL_TREE_PLACEMENT.rotationY, 0]}
      scale={SKILL_TREE_PLACEMENT.scale}
    >
      <primitive object={scene} dispose={null} />

      {/* Central CORE SKILLS emblem badge */}
      <Text
        position={[0, 0.376, 0.036]}
        fontSize={0.0185}
        fontWeight={700}
        color="#ffe694"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.0022}
        outlineColor="#2b1407"
        letterSpacing={0.04}
      >
        CORE SKILLS
      </Text>

      {/* Subtle warm board fill light when actively inspecting the skill tree */}
      {isInteractive && (
        <pointLight
          position={[0, 0.3, 0.72]}
          color="#ffdca6"
          intensity={1.25}
          distance={2.6}
          decay={2}
        />
      )}

      {/* Subtle golden highlight light on the hovered/selected branch */}
      {isInteractive && activeAccentCategory && (
        <pointLight
          position={[
            activeAccentCategory.hitboxCenter[0],
            activeAccentCategory.hitboxCenter[1],
            0.22,
          ]}
          color="#ffca63"
          intensity={selectedCategoryId ? 0.55 : 0.3}
          distance={0.8}
          decay={2}
        />
      )}

      {/* Four branch plaques, skill node labels, and raycastable hit zones */}
      {SKILL_CATEGORIES.map((category) => {
        const isSelected = isInteractive && selectedCategoryId === category.id;
        const isHovered = isInteractive && hoveredCategoryId === category.id;
        const plaqueColor = isSelected
          ? '#fff3bd'
          : isHovered
            ? '#ffe694'
            : '#f6d478';

        return (
          <group key={category.id} name={`SkillBranch_${category.id}`}>
            {/* Category wooden plaque label */}
            <Text
              position={category.plaquePosition}
              fontSize={0.025}
              fontWeight={700}
              color={plaqueColor}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.0024}
              outlineColor="#261206"
              letterSpacing={0.02}
            >
              {category.plaqueLabel}
            </Text>

            {/* Individual skill node labels positioned beside the 3D nodes */}
            {category.nodes.map((node) => {
              const isNodeHovered = isInteractive && hoveredNodeId === node.id;
              return (
                <Text
                  key={node.id}
                  position={node.position}
                  fontSize={0.0175}
                  fontWeight={700}
                  lineHeight={1.08}
                  color={
                    isNodeHovered
                      ? '#ffffff'
                      : isSelected
                        ? '#fff6d1'
                        : '#f5dfb2'
                  }
                  anchorX={
                    node.align === 'left'
                      ? 'left'
                      : node.align === 'right'
                        ? 'right'
                        : 'center'
                  }
                  anchorY="middle"
                  outlineWidth={0.002}
                  outlineColor="#241105"
                  onPointerOver={(e) => {
                    if (!isInteractive) return;
                    e.stopPropagation();
                    setHoveredNodeId(node.id);
                    setHoveredCategoryId(category.id);
                    document.body.style.cursor = 'pointer';
                  }}
                  onPointerOut={(e) => {
                    if (!isInteractive) return;
                    e.stopPropagation();
                    setHoveredNodeId((prev) => (prev === node.id ? null : prev));
                  }}
                  onClick={handleClick(category.id)}
                >
                  {node.label}
                </Text>
              );
            })}

            {/* Invisible interactive hit area covering the branch quadrant */}
            {isInteractive && (
              <mesh
                name={`SkillBranchHitbox_${category.id}`}
                position={category.hitboxCenter}
                onPointerOver={handlePointerOver(category.id)}
                onPointerOut={handlePointerOut(category.id)}
                onClick={handleClick(category.id)}
              >
                <planeGeometry args={category.hitboxSize} />
                <meshBasicMaterial
                  color="#ffd27d"
                  transparent
                  opacity={isSelected ? 0.08 : isHovered ? 0.04 : 0}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

useGLTF.preload(SKILL_TREE_MODEL_PATH);
