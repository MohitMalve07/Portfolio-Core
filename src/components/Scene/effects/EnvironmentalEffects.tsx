import { AmbientDust } from './AmbientDust';
import { DeskCharacterParticles } from './DeskCharacterParticles';
import { FireplaceParticles } from './FireplaceParticles';
import { LanternParticles } from './LanternParticles';
import { useParticleEnvironment } from './useVisibilityAndQuality';

// Exact world-space centers of Mantel_Oil_Lantern and Floor_Oil_Lantern from GLB
const MANTEL_LANTERN_CENTER: [number, number, number] = [-1.17, 1.62, 0];
const FLOOR_LANTERN_CENTER: [number, number, number] = [2.1152, 0.22, 1.7218];

/**
 * Unified atmospheric particle suite for the Adventure Workshop:
 * rising fireplace embers, lantern fireflies, cat-lamp aura sparkles,
 * and subtle cabin dust motes.
 */
export function EnvironmentalEffects() {
  const { isTabVisibleRef, densityScale } = useParticleEnvironment();

  return (
    <group name="Workshop_Environmental_Effects">
      <FireplaceParticles
        isTabVisibleRef={isTabVisibleRef}
        densityScale={densityScale}
      />
      <LanternParticles
        center={MANTEL_LANTERN_CENTER}
        radius={0.16}
        count={13}
        isTabVisibleRef={isTabVisibleRef}
        densityScale={densityScale}
      />
      <LanternParticles
        center={FLOOR_LANTERN_CENTER}
        radius={0.2}
        count={15}
        isTabVisibleRef={isTabVisibleRef}
        densityScale={densityScale}
      />
      <DeskCharacterParticles
        isTabVisibleRef={isTabVisibleRef}
        densityScale={densityScale}
      />
      <AmbientDust
        isTabVisibleRef={isTabVisibleRef}
        densityScale={densityScale}
      />
    </group>
  );
}
