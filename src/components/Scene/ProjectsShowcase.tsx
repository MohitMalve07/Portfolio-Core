import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  PROJECTS,
  type ProjectId,
  type ProjectObjectName,
} from '../../data/projects';
import { ProjectModel } from './ProjectModel';

export const PROJECTS_MODEL_PATH = '/Models/Projects_optimized.glb';

interface ProjectsShowcaseProps {
  isInteractive: boolean;
  selectedProjectId: ProjectId | null;
  onSelectProject: (id: ProjectId) => void;
}

function classifyTriangle(
  cx: number,
  cz: number,
): ProjectObjectName {
  if (cx < -0.2) return 'Van';
  if (cz > -0.065 && cx < 0.19) return 'ChessClock';
  return 'RacingKart';
}

/**
 * Extracts a standalone indexed BufferGeometry for one object from the combined
 * projects.glb mesh and anchors its origin to bottom-center (centerX, minY, centerZ).
 */
function buildSubGeometry(
  source: THREE.BufferGeometry,
  triIndices: number[],
): THREE.BufferGeometry {
  const srcPos = source.getAttribute('position') as THREE.BufferAttribute;
  const srcNorm = source.getAttribute('normal') as THREE.BufferAttribute | undefined;
  const srcUv = source.getAttribute('uv') as THREE.BufferAttribute | undefined;

  const remap = new Map<number, number>();
  const newIndices = new Uint32Array(triIndices.length);
  const oldIndices: number[] = [];

  for (let i = 0; i < triIndices.length; i++) {
    const oldIdx = triIndices[i];
    let nextIdx = remap.get(oldIdx);
    if (nextIdx === undefined) {
      nextIdx = oldIndices.length;
      remap.set(oldIdx, nextIdx);
      oldIndices.push(oldIdx);
    }
    newIndices[i] = nextIdx;
  }

  const count = oldIndices.length;
  const posArr = new Float32Array(count * 3);
  const normArr = srcNorm ? new Float32Array(count * 3) : null;
  const uvArr = srcUv ? new Float32Array(count * 2) : null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const idx = oldIndices[i];
    const x = srcPos.getX(idx);
    const y = srcPos.getY(idx);
    const z = srcPos.getZ(idx);

    posArr[i * 3] = x;
    posArr[i * 3 + 1] = y;
    posArr[i * 3 + 2] = z;

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;

    if (normArr && srcNorm) {
      normArr[i * 3] = srcNorm.getX(idx);
      normArr[i * 3 + 1] = srcNorm.getY(idx);
      normArr[i * 3 + 2] = srcNorm.getZ(idx);
    }
    if (uvArr && srcUv) {
      uvArr[i * 2] = srcUv.getX(idx);
      uvArr[i * 2 + 1] = srcUv.getY(idx);
    }
  }

  // Re-center horizontally and ground bottom-most vertex at y = 0
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  for (let i = 0; i < count; i++) {
    posArr[i * 3] -= cx;
    posArr[i * 3 + 1] -= minY;
    posArr[i * 3 + 2] -= cz;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  if (normArr) geom.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
  if (uvArr) geom.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));
  geom.setIndex(new THREE.BufferAttribute(newIndices, 1));
  geom.computeBoundingBox();
  geom.computeBoundingSphere();

  return geom;
}

/**
 * Loads public/Models/projects.glb, isolates Van, ChessClock, and RacingKart
 * into independent interactive collectible models on the desk top shelf.
 */
export function ProjectsShowcase({
  isInteractive,
  selectedProjectId,
  onSelectProject,
}: ProjectsShowcaseProps) {
  const { scene } = useGLTF(PROJECTS_MODEL_PATH);
  const { gl } = useThree();

  const extracted = useMemo(() => {
    let sourceMesh: THREE.Mesh | null = null;
    scene.traverse((child) => {
      if (!sourceMesh && child instanceof THREE.Mesh) {
        sourceMesh = child;
      }
    });

    if (!sourceMesh) return null;
    const mesh = sourceMesh as THREE.Mesh;
    const geom = mesh.geometry;
    const baseMaterial = Array.isArray(mesh.material)
      ? mesh.material[0]
      : mesh.material;

    const pos = geom.getAttribute('position') as THREE.BufferAttribute;
    const idxAttr = geom.getIndex();
    const triBuckets: Record<ProjectObjectName, number[]> = {
      Van: [],
      ChessClock: [],
      RacingKart: [],
    };

    const triCount = idxAttr ? idxAttr.count : pos.count;
    for (let i = 0; i < triCount; i += 3) {
      const a = idxAttr ? idxAttr.getX(i) : i;
      const b = idxAttr ? idxAttr.getX(i + 1) : i + 1;
      const c = idxAttr ? idxAttr.getX(i + 2) : i + 2;

      const cx = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3;
      const cz = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3;
      const kind = classifyTriangle(cx, cz);
      triBuckets[kind].push(a, b, c);
    }

    const geometries: Record<ProjectObjectName, THREE.BufferGeometry> = {
      Van: buildSubGeometry(geom, triBuckets.Van),
      ChessClock: buildSubGeometry(geom, triBuckets.ChessClock),
      RacingKart: buildSubGeometry(geom, triBuckets.RacingKart),
    };

    return { geometries, baseMaterial };
  }, [scene]);

  useEffect(() => {
    if (!extracted) return;
    const maxAnisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    if (extracted.baseMaterial instanceof THREE.MeshStandardMaterial) {
      if (extracted.baseMaterial.map) {
        extracted.baseMaterial.map.anisotropy = maxAnisotropy;
      }
      if (extracted.baseMaterial.normalMap) {
        extracted.baseMaterial.normalMap.anisotropy = maxAnisotropy;
      }
      if (extracted.baseMaterial.roughnessMap) {
        extracted.baseMaterial.roughnessMap.anisotropy = maxAnisotropy;
      }
    }
  }, [extracted, gl]);

  if (!extracted) return null;

  return (
    <group name="Projects_Desk_Collectibles">
      {PROJECTS.map((project) => (
        <ProjectModel
          key={project.id}
          project={project}
          geometry={extracted.geometries[project.objectName]}
          baseMaterial={extracted.baseMaterial}
          isInteractive={isInteractive}
          isSelected={selectedProjectId === project.id}
          onSelect={onSelectProject}
        />
      ))}
    </group>
  );
}

useGLTF.preload(PROJECTS_MODEL_PATH);
