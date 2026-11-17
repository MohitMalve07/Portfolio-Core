import { useEffect, useMemo, useRef } from 'react';

/**
 * Tracks browser tab visibility to pause particle simulation when hidden
 * and exposes a device-tier density scale factor.
 */
export function useParticleEnvironment() {
  const isTabVisibleRef = useRef(
    typeof document === 'undefined' ? true : !document.hidden,
  );

  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const densityScale = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    const lowCores =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency <= 4;
    const smallViewport = window.innerWidth < 768;
    return lowCores || smallViewport ? 0.55 : 1;
  }, []);

  return { isTabVisibleRef, densityScale };
}
