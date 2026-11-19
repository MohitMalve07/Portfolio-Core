import type { SectionId } from './navigation';

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Original Blender camera composition from AdventureWorkshop_Lighting_Polish.blend
 * converted to glTF Y-up coordinates.
 */
export const OVERVIEW_CAMERA_POSE: CameraPose = {
  position: [-2.32073, 1.90028, 3.63591],
  target: [0.16249, 1.18046, 0.58378],
  fov: 51.282,
};

/**
 * World-space anchor directly on the front face of BackWall_Corkboard
 * (center [-0.54, 1.919, -0.455], front z = -0.395) so the pinned paper note
 * sits physically attached to the bulletin board.
 */
export const ABOUT_ME_CARD_ANCHOR: [number, number, number] = [-0.54, 1.919, -0.402];

/**
 * Per-section cinematic camera destinations derived from GLB object transforms
 * and room obstacle bounds. Sections without a dedicated anchor yet fall back
 * to the overview composition.
 */
export const SECTION_CAMERA_POSES: Partial<Record<SectionId, CameraPose>> = {
  // Paper note world bounds at ABOUT_ME_CARD_ANCHOR: ~0.31m x 0.21m (~35% of BackWall_Corkboard's
  // 0.86m usable width). Camera at d=0.52m with 34deg lens gives visibleHeight=0.32m / visibleWidth=0.48-0.51m
  // so the paper occupies ~63-66% of viewport width with surrounding corkboard margin and zero cabin clutter.
  about: {
    position: [-0.65, 1.919, 0.12],
    target: [-0.61, 1.919, -0.402],
    fov: 34,
  },
  // Derived from Trophy_Shelf_Collection upper shelf trophies (x≈2.258, y∈[2.125,2.428], z∈[-0.441,0.375]).
  // Positioned at y=2.24 (clearing Desk y<=1.898, Desk_Book_Stack y<=1.983, Chair y<=1.657,
  // and below Ceiling_LightStrand_2 y>=2.67) with target shifted left (-Z) so trophies sit clear of MainMenu.
  experience: {
    position: [1.14, 2.24, 0.28],
    target: [2.25, 2.15, -0.16],
    fov: 38,
  },
  // Derived from Desk upper top shelf (y=1.804, x∈[0.76,1.48], z∈[-0.499,-0.045]) and the three
  // miniature project collectibles (x∈[0.81,1.44], z∈[-0.36,-0.15]). Three-quarter close-up above
  // Monitor_2 (y<=1.44) and clear of Desk_Cat_Lamp (x<=0.575) & MainMenu.
  projects: {
    position: [0.42, 2.09, 0.54],
    target: [1.0, 1.83, -0.27],
    fov: 38,
  },
  // Derived from SkillTree_WallMount above Cabin_Bed (center [2.385, 1.744, 3.07],
  // width 1.224m along Z, height 0.728m along Y). Positioned right of Cabin_Window_Frame (z>=2.05)
  // above the bed (y>=0.941) in a natural 3/4 view clearing MainMenu.
  skills: {
    position: [0.82, 1.72, 2.3],
    target: [2.3, 1.68, 2.8],
    fov: 42,
  },
  // Derived from LetterBox placement on the fireplace mantel beside Mantel_Oil_Lantern
  // ([-1.47, 1.409, 0.025], scale 0.34, height 0.34m, rotationY=0.25). Close-up 3/4 view
  // framing the LetterBox and lantern on the stone mantel clear of MainMenu and ContactLetter.
  contact: {
    position: [-0.86, 1.72, 1.05],
    target: [-1.4, 1.56, -0.015],
    fov: 36,
  },
};

export function getCameraPoseForSection(section: SectionId | null): CameraPose {
  if (!section) return OVERVIEW_CAMERA_POSE;
  return SECTION_CAMERA_POSES[section] ?? OVERVIEW_CAMERA_POSE;
}

interface ResponsivePoseBounds {
  refAspect: number;
  maxFov: number;
  maxDistScale: number;
}

const RESPONSIVE_SECTION_BOUNDS: Record<'overview' | SectionId, ResponsivePoseBounds> = {
  overview: { refAspect: 1.35, maxFov: 74, maxDistScale: 1.0 },
  about: { refAspect: 1.25, maxFov: 60, maxDistScale: 1.35 },
  experience: { refAspect: 1.45, maxFov: 70, maxDistScale: 1.32 },
  projects: { refAspect: 1.45, maxFov: 68, maxDistScale: 1.35 },
  skills: { refAspect: 1.45, maxFov: 72, maxDistScale: 1.3 },
  contact: { refAspect: 1.4, maxFov: 64, maxDistScale: 1.25 },
};

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Expands vertical FOV (and pulls close-up cameras gently back within safe
 * room bounds) on narrow/portrait screens so collectibles, trophies, and skill
 * branches stay inside the horizontal viewport without clipping.
 */
export function getResponsiveCameraPose(
  section: SectionId | null,
  aspect: number,
): CameraPose {
  const base = getCameraPoseForSection(section);
  if (!Number.isFinite(aspect) || aspect <= 0) return base;

  const { refAspect, maxFov, maxDistScale } =
    RESPONSIVE_SECTION_BOUNDS[section ?? 'overview'];

  if (aspect >= refAspect) return base;

  const neededRatio = refAspect / Math.max(aspect, 0.42);
  const baseHalfTan = Math.tan(base.fov * 0.5 * DEG_TO_RAD);
  const maxHalfTan = Math.tan(maxFov * 0.5 * DEG_TO_RAD);
  const idealHalfTan = baseHalfTan * neededRatio;
  const appliedHalfTan = Math.min(idealHalfTan, maxHalfTan);
  const effectiveFov = Math.atan(appliedHalfTan) * 2 * RAD_TO_DEG;

  const distScale = Math.min(
    maxDistScale,
    Math.max(1, idealHalfTan / appliedHalfTan),
  );

  if (distScale <= 1.001) {
    return { ...base, fov: effectiveFov };
  }

  const [px, py, pz] = base.position;
  const [tx, ty, tz] = base.target;
  return {
    position: [
      tx + (px - tx) * distScale,
      ty + (py - ty) * distScale,
      tz + (pz - tz) * distScale,
    ],
    target: base.target,
    fov: effectiveFov,
  };
}
