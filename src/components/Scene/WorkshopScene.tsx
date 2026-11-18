import { memo, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { TrophyId } from '../../data/achievements';
import { OVERVIEW_CAMERA_POSE } from '../../data/cameraAnchors';
import type { SectionId } from '../../data/navigation';
import type { ProjectId } from '../../data/projects';
import type { SkillCategoryId } from '../../data/skills';
import type { ContactLetterStage } from '../../hooks/useWorkshopNavigation';
import { AboutMeCard } from './AboutMeCard';
import { CameraController } from './CameraController';
import { ContactShowcase } from './ContactShowcase';
import { EnvironmentalEffects } from './effects/EnvironmentalEffects';
import { ProjectsShowcase } from './ProjectsShowcase';
import { SceneErrorBoundary } from './SceneErrorBoundary';
import { SkillsShowcase } from './SkillsShowcase';
import { TrophyShelf } from './TrophyShelf';
import { WorkshopLights } from './WorkshopLights';
import { WorkshopModel } from './WorkshopModel';

const MemoizedWorkshopModel = memo(WorkshopModel);
const MemoizedWorkshopLights = memo(WorkshopLights);

/**
 * Attempts WebGL context creation across progressive hardware/driver tiers
 * so hybrid-GPU laptops or strict browser privacy modes don't fail on
 * high-performance or MSAA requirements.
 */
function createResilientRenderer(
  defaults: Record<string, unknown>,
): THREE.WebGLRenderer {
  const canvas = defaults.canvas as HTMLCanvasElement;
  const attempts: THREE.WebGLRendererParameters[] = [
    { canvas, antialias: true, alpha: false, powerPreference: 'default' },
    { canvas, antialias: false, alpha: false, powerPreference: 'default' },
    {
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
    },
  ];

  let lastError: unknown;
  for (const params of attempts) {
    try {
      const renderer = new THREE.WebGLRenderer(params);
      renderer.toneMapping = THREE.AgXToneMapping;
      renderer.toneMappingExposure = 0.92;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.addEventListener(
        'webglcontextlost',
        (event) => {
          event.preventDefault();
        },
        false,
      );
      return renderer;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('THREE.WebGLRenderer: Error creating WebGL context.');
}

interface WorkshopSceneProps {
  activeSection: SectionId | null;
  arrivedSection: SectionId | null;
  selectedTrophyId: TrophyId | null;
  selectedProjectId: ProjectId | null;
  selectedSkillCategoryId: SkillCategoryId | null;
  contactLetterStage: ContactLetterStage;
  onSceneReady?: () => void;
  onSceneError?: (error: Error) => void;
  onCameraTransitionStart?: () => void;
  onCameraTransitionComplete?: (section: SectionId | null) => void;
  onCloseSection?: () => void;
  onSelectTrophy?: (id: TrophyId) => void;
  onSelectProject?: (id: ProjectId) => void;
  onSelectSkillCategory?: (id: SkillCategoryId) => void;
  onOpenContactMailbox?: () => void;
  onCompleteContactReveal?: () => void;
}

export function WorkshopScene({
  activeSection,
  arrivedSection,
  selectedTrophyId,
  selectedProjectId,
  selectedSkillCategoryId,
  contactLetterStage,
  onSceneReady,
  onSceneError,
  onCameraTransitionStart,
  onCameraTransitionComplete,
  onCloseSection,
  onSelectTrophy,
  onSelectProject,
  onSelectSkillCategory,
  onOpenContactMailbox,
  onCompleteContactReveal,
}: WorkshopSceneProps) {
  // Match Blender World color [0.055, 0.095, 0.180] * strength 0.75 (linear sRGB)
  const worldBgColor = useMemo(
    () =>
      new THREE.Color().setRGB(
        0.055 * 0.75,
        0.095 * 0.75,
        0.18 * 0.75,
        THREE.LinearSRGBColorSpace,
      ),
    [],
  );

  const showAboutMeCard =
    activeSection === 'about' && arrivedSection === 'about';
  const isExperienceActive =
    activeSection === 'experience' && arrivedSection === 'experience';
  const isProjectsInteractive =
    activeSection === 'projects' && arrivedSection === 'projects';
  const isSkillsInteractive =
    activeSection === 'skills' && arrivedSection === 'skills';
  const isContactInteractive =
    activeSection === 'contact' && arrivedSection === 'contact';

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1e2b42]">
      <SceneErrorBoundary onError={onSceneError}>
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          dpr={[1, 1.5]}
          camera={{
            position: OVERVIEW_CAMERA_POSE.position,
            fov: OVERVIEW_CAMERA_POSE.fov,
            near: 0.05,
            far: 100,
          }}
          gl={(defaults) => createResilientRenderer(defaults)}
        >
          <primitive object={worldBgColor} attach="background" />
          <CameraController
            activeSection={activeSection}
            onTransitionStart={onCameraTransitionStart}
            onTransitionComplete={onCameraTransitionComplete}
          />
          <MemoizedWorkshopLights />
          <EnvironmentalEffects />
          <Suspense fallback={null}>
            <MemoizedWorkshopModel onLoaded={onSceneReady} />
            <ProjectsShowcase
              isInteractive={isProjectsInteractive}
              selectedProjectId={selectedProjectId}
              onSelectProject={(id) => onSelectProject?.(id)}
            />
            <SkillsShowcase
              isInteractive={isSkillsInteractive}
              selectedCategoryId={selectedSkillCategoryId}
              onSelectCategory={(id) => onSelectSkillCategory?.(id)}
            />
            <ContactShowcase
              isInteractive={isContactInteractive}
              letterStage={isContactInteractive ? contactLetterStage : 'closed'}
              onOpenMailbox={() => onOpenContactMailbox?.()}
              onRevealComplete={() => onCompleteContactReveal?.()}
            />
          </Suspense>
          <AboutMeCard
            visible={showAboutMeCard}
            onClose={() => onCloseSection?.()}
          />
          <TrophyShelf
            isActive={isExperienceActive}
            selectedTrophyId={selectedTrophyId}
            onSelectTrophy={(id) => onSelectTrophy?.(id)}
          />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
