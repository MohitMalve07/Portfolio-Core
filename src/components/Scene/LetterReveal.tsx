import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

interface LetterRevealProps {
  isRevealing: boolean;
  isVisible: boolean;
  onRevealComplete: () => void;
}

/**
 * Physical 3D sealed parchment envelope emerging smoothly from the LetterBox's
 * front mail slot via GSAP before opening the Contact letter.
 */
export function LetterReveal({
  isRevealing,
  isVisible,
  onRevealComplete,
}: LetterRevealProps) {
  const envelopeRef = useRef<THREE.Group>(null);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);

  // Clean flat triangular envelope flap geometry (zero cone self-shadowing)
  const flapGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.152, 0.098);
    shape.lineTo(0.152, 0.098);
    shape.lineTo(0, -0.015);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  useEffect(() => {
    return () => {
      flapGeometry.dispose();
    };
  }, [flapGeometry]);

  useEffect(() => {
    const env = envelopeRef.current;
    if (!env) return;

    tweenRef.current?.kill();

    if (isRevealing) {
      // Start tucked inside the front mail slot of LetterBox (local y≈0.74, z≈0.20)
      env.position.set(0, 0.74, 0.2);
      env.rotation.set(0.16, 0, 0);
      env.scale.set(0.32, 0.32, 0.32);

      const tl = gsap.timeline({
        onComplete: () => {
          tweenRef.current = null;
          onRevealComplete();
        },
      });

      tl.to(env.position, {
        y: 0.96,
        z: 0.44,
        duration: 0.42,
        ease: 'power2.out',
      })
        .to(
          env.scale,
          { x: 0.95, y: 0.95, z: 0.95, duration: 0.42, ease: 'back.out(1.6)' },
          0,
        )
        .to(
          env.rotation,
          { x: -0.14, y: 0.08, z: -0.04, duration: 0.42, ease: 'power2.out' },
          0,
        )
        .to(env.position, {
          y: 1.06,
          z: 0.48,
          duration: 0.24,
          ease: 'power1.inOut',
        });

      tweenRef.current = tl;
    }

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [isRevealing, onRevealComplete]);

  if (!isRevealing && !isVisible) return null;

  return (
    <group
      ref={envelopeRef}
      name="LetterBox_EnvelopeReveal"
      position={[0, 1.06, 0.48]}
      rotation={[-0.14, 0.08, -0.04]}
      scale={0.95}
    >
      {/* Cream parchment envelope body */}
      <mesh castShadow>
        <boxGeometry args={[0.31, 0.2, 0.014]} />
        <meshStandardMaterial color="#f3e4c3" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Flat folded upper triangular flap */}
      <mesh geometry={flapGeometry} position={[0, 0, 0.0085]}>
        <meshStandardMaterial
          color="#e4cfa2"
          roughness={0.85}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Small crimson wax seal */}
      <mesh position={[0, -0.015, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.006, 20]} />
        <meshStandardMaterial color="#9e2a22" roughness={0.45} metalness={0.08} />
      </mesh>
    </group>
  );
}
