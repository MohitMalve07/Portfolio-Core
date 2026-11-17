import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const WORKSHOP_MODEL_PATH = '/Models/adventurecabin_optimized.glb';

const NO_SHADOW_CAST_NAMES = new Set([
  'Ceiling_LightStrand_1',
  'Ceiling_LightStrand_2',
  'Desk_Cat_Lamp',
  'Floor_Oil_Lantern',
  'Mantel_Oil_Lantern',
  'Exterior_Snow_Ground',
  'Exterior_Snow_Trees_1',
  'Exterior_Snow_Trees_2',
]);

const patchedMaterials = new WeakSet<THREE.Material>();

/**
 * Replicates Blender's procedural emission masks on materials whose node trees
 * were flattened during glTF export, without altering the GLB asset itself.
 */
function applyBlenderEmissionMasks(material: THREE.MeshStandardMaterial) {
  if (patchedMaterials.has(material)) return;

  if (material.name === 'tripo_material_47683ab6-e86c-49b7-9723-dadf38b7370a') {
    // Cabin_Stone_Fireplace: restrict emission strictly to the inner firebox flames
    patchedMaterials.add(material);
    material.customProgramCacheKey = () => 'fireplace-localized-flame-v1';
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying vec3 vFireplaceLocalPos;',
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvFireplaceLocalPos = position;',
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying vec3 vFireplaceLocalPos;',
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          {
            float inX = smoothstep(-0.135, -0.115, vFireplaceLocalPos.x) * (1.0 - smoothstep(0.115, 0.135, vFireplaceLocalPos.x));
            float inY = smoothstep(0.155, 0.175, vFireplaceLocalPos.y) * (1.0 - smoothstep(0.335, 0.355, vFireplaceLocalPos.y));
            float inZ = smoothstep(-0.135, -0.115, vFireplaceLocalPos.z) * (1.0 - smoothstep(0.025, 0.045, vFireplaceLocalPos.z));
            float flameRegion = inX * inY * inZ;
            #ifdef USE_EMISSIVEMAP
              float flameLuma = dot(emissiveColor.rgb, vec3(0.2126, 0.7152, 0.0722));
            #else
              float flameLuma = 0.0;
            #endif
            float lumaMask = clamp((flameLuma - 0.45) / (0.78 - 0.45), 0.0, 1.0);
            totalEmissiveRadiance *= flameRegion * lumaMask;
          }`,
        );
    };
    material.needsUpdate = true;
  } else if (material.name === 'tripo_material_47724856-1fe9-4d10-af67-bb28afea4f0e') {
    // Oil lanterns: emit only from the bright glass/flame core, keep bronze housing dark
    patchedMaterials.add(material);
    material.customProgramCacheKey = () => 'lantern-core-emission-v1';
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          #ifdef USE_EMISSIVEMAP
            float lanternLuma = dot(emissiveColor.rgb, vec3(0.2126, 0.7152, 0.0722));
          #else
            float lanternLuma = 0.0;
          #endif
          float lumaMask = clamp((lanternLuma - 0.58) / (0.85 - 0.58), 0.0, 1.0);
          totalEmissiveRadiance *= lumaMask;
        }`,
      );
    };
    material.needsUpdate = true;
  } else if (material.name === 'Desk_Cat_Lamp_Glow') {
    // Cat lamp: emit from warm cream body while keeping dark eyes/mouth un-emissive
    patchedMaterials.add(material);
    material.customProgramCacheKey = () => 'cat-lamp-emission-v1';
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          #ifdef USE_EMISSIVEMAP
            float catLuma = dot(emissiveColor.rgb, vec3(0.2126, 0.7152, 0.0722));
          #else
            float catLuma = 0.0;
          #endif
          float lumaMask = clamp((catLuma - 0.30) / (0.55 - 0.30), 0.0, 1.0);
          totalEmissiveRadiance *= lumaMask;
        }`,
      );
    };
    material.needsUpdate = true;
  }
}

interface WorkshopModelProps {
  onLoaded?: () => void;
}

export function WorkshopModel({ onLoaded }: WorkshopModelProps) {
  const { scene } = useGLTF(WORKSHOP_MODEL_PATH);
  const { gl } = useThree();

  useEffect(() => {
    const maxAnisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const rootName = obj.name || obj.parent?.name || '';
        const skipCast = NO_SHADOW_CAST_NAMES.has(rootName);

        obj.castShadow = !skipCast;
        obj.receiveShadow = true;

        const materials = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];

        for (const mat of materials) {
          if (!mat) continue;
          if (mat instanceof THREE.MeshStandardMaterial) {
            if (mat.map) mat.map.anisotropy = maxAnisotropy;
            if (mat.normalMap) mat.normalMap.anisotropy = maxAnisotropy;
            if (mat.roughnessMap) mat.roughnessMap.anisotropy = maxAnisotropy;
            applyBlenderEmissionMasks(mat);
          }
          mat.needsUpdate = true;
        }
      }
    });

    onLoaded?.();
  }, [scene, gl, onLoaded]);

  return <primitive object={scene} dispose={null} />;
}

useGLTF.preload(WORKSHOP_MODEL_PATH);
