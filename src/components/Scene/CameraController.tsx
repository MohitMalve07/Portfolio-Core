import { useEffect, useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import {
  getCameraPoseForSection,
  OVERVIEW_CAMERA_POSE,
} from '../../data/cameraAnchors';
import type { SectionId } from '../../data/navigation';

interface CameraControllerProps {
  activeSection: SectionId | null;
  onTransitionStart?: () => void;
  onTransitionComplete?: (section: SectionId | null) => void;
}

/**
 * Reusable GSAP-driven camera controller that transitions smoothly between
 * the workshop overview and section focal anchors without overlapping tweens.
 */
export function CameraController({
  activeSection,
  onTransitionStart,
  onTransitionComplete,
}: CameraControllerProps) {
  const { camera } = useThree();
  const initializedRef = useRef(false);
  const currentTargetRef = useRef(new THREE.Vector3(...OVERVIEW_CAMERA_POSE.target));
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Snap to exact Blender overview camera on initial mount
  useLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    camera.position.set(...OVERVIEW_CAMERA_POSE.position);
    currentTargetRef.current.set(...OVERVIEW_CAMERA_POSE.target);
    camera.up.set(0, 1, 0);
    camera.lookAt(currentTargetRef.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = OVERVIEW_CAMERA_POSE.fov;
      camera.near = 0.05;
      camera.far = 100;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useEffect(() => {
    const dest = getCameraPoseForSection(activeSection);
    const destPos = new THREE.Vector3(...dest.position);
    const destTarget = new THREE.Vector3(...dest.target);
    const isPerspective = camera instanceof THREE.PerspectiveCamera;
    const fovDelta = isPerspective ? Math.abs(camera.fov - dest.fov) : 0;

    // Cancel any active camera flight before starting the next one
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }

    const posDelta = camera.position.distanceTo(destPos);
    const targetDelta = currentTargetRef.current.distanceTo(destTarget);

    // Already at destination (e.g. initial load or switching between sections sharing overview)
    if (posDelta < 0.005 && targetDelta < 0.005 && fovDelta < 0.05) {
      camera.position.copy(destPos);
      currentTargetRef.current.copy(destTarget);
      if (isPerspective) {
        camera.fov = dest.fov;
        camera.updateProjectionMatrix();
      }
      camera.lookAt(currentTargetRef.current);
      onTransitionComplete?.(activeSection);
      return;
    }

    const tl = gsap.timeline({
      onStart: () => {
        onTransitionStart?.();
      },
      onUpdate: () => {
        if (isPerspective) {
          camera.updateProjectionMatrix();
        }
        camera.lookAt(currentTargetRef.current);
      },
      onComplete: () => {
        activeTimelineRef.current = null;
        if (isPerspective) {
          camera.updateProjectionMatrix();
        }
        camera.lookAt(currentTargetRef.current);
        onTransitionComplete?.(activeSection);
      },
    });

    tl.to(
      camera.position,
      {
        x: destPos.x,
        y: destPos.y,
        z: destPos.z,
        duration: 1.25,
        ease: 'power2.inOut',
      },
      0,
    ).to(
      currentTargetRef.current,
      {
        x: destTarget.x,
        y: destTarget.y,
        z: destTarget.z,
        duration: 1.25,
        ease: 'power2.inOut',
      },
      0,
    );

    if (isPerspective) {
      tl.to(
        camera,
        {
          fov: dest.fov,
          duration: 1.25,
          ease: 'power2.inOut',
        },
        0,
      );
    }

    activeTimelineRef.current = tl;

    return () => {
      tl.kill();
      if (activeTimelineRef.current === tl) {
        activeTimelineRef.current = null;
      }
    };
  }, [activeSection, camera, onTransitionStart, onTransitionComplete]);

  return null;
}
