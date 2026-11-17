import { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

export const LETTERBOX_MODEL_PATH = '/Models/LetterBox_optimized.glb';

interface LetterBoxModelProps {
  isInteractive: boolean;
  isActivated: boolean;
  onOpen: () => void;
}

/**
 * Loads public/Models/LetterBox.glb with its original materials/geometry preserved,
 * adds raycast hover/click feedback, and plays a playful GSAP lid/chest pop animation
 * when clicked.
 */
export function LetterBoxModel({
  isInteractive,
  isActivated,
  onOpen,
}: LetterBoxModelProps) {
  const { scene } = useGLTF(LETTERBOX_MODEL_PATH);
  const { gl } = useThree();
  const [isHovered, setIsHovered] = useState(false);

  const animGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const activeTweenRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const maxAnisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    const mats: THREE.MeshStandardMaterial[] = [];

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        const list = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of list) {
          if (mat instanceof THREE.MeshStandardMaterial) {
            if (mat.map) mat.map.anisotropy = maxAnisotropy;
            if (mat.normalMap) mat.normalMap.anisotropy = maxAnisotropy;
            if (mat.roughnessMap) mat.roughnessMap.anisotropy = maxAnisotropy;
            mat.emissive = new THREE.Color('#ffbd4a');
            mat.emissiveIntensity = 0;
            mat.needsUpdate = true;
            if (!mats.includes(mat)) mats.push(mat);
          }
        }
      }
    });

    materialsRef.current = mats;
  }, [scene, gl]);

  useEffect(() => {
    if (!isInteractive) {
      setIsHovered(false);
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isInteractive]);

  // Subtle physical chest pop/open animation when LetterBox is activated
  useEffect(() => {
    const grp = animGroupRef.current;
    if (!grp) return;

    activeTweenRef.current?.kill();

    if (isActivated) {
      const tl = gsap.timeline();
      tl.to(grp.scale, {
        x: 1.06,
        y: 0.92,
        z: 1.06,
        duration: 0.14,
        ease: 'power2.out',
      })
        .to(
          grp.rotation,
          { x: -0.14, duration: 0.22, ease: 'back.out(2)' },
          0.08,
        )
        .to(
          grp.scale,
          { x: 0.98, y: 1.06, z: 0.98, duration: 0.2, ease: 'power2.out' },
          0.14,
        )
        .to(grp.position, { y: 0.03, duration: 0.18, ease: 'power2.out' }, 0.14)
        .to(grp.rotation, { x: 0, duration: 0.32, ease: 'elastic.out(1, 0.5)' })
        .to(
          grp.scale,
          { x: 1, y: 1, z: 1, duration: 0.28, ease: 'power2.out' },
          '<',
        )
        .to(grp.position, { y: 0, duration: 0.26, ease: 'power2.out' }, '<');
      activeTweenRef.current = tl;
    } else {
      grp.position.set(0, 0, 0);
      grp.rotation.set(0, 0, 0);
      grp.scale.set(1, 1, 1);
    }

    return () => {
      activeTweenRef.current?.kill();
      activeTweenRef.current = null;
    };
  }, [isActivated]);

  useFrame(({ clock }) => {
    const targetEmissive = !isInteractive
      ? 0
      : isActivated
        ? 0.18 + Math.sin(clock.getElapsedTime() * 3.0) * 0.04
        : isHovered
          ? 0.14
          : 0;

    for (const mat of materialsRef.current) {
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        targetEmissive,
        0.16,
      );
    }

    if (ringRef.current && isInteractive && (isHovered || isActivated)) {
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
    onOpen();
  };

  return (
    <group>
      <group
        ref={animGroupRef}
        name="Workshop_LetterBox"
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <primitive object={scene} dispose={null} />
      </group>

      {isInteractive && (isHovered || isActivated) && (
        <mesh
          ref={ringRef}
          position={[0, 0.008, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.36, 0.42, 36]} />
          <meshBasicMaterial
            color={isActivated ? '#ffd36b' : '#ffe6a8'}
            transparent
            opacity={isActivated ? 0.85 : 0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload(LETTERBOX_MODEL_PATH);
