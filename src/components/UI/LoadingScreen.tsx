import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import { Flame } from 'lucide-react';

interface LoadingScreenProps {
  isSceneReady: boolean;
  loadError: Error | null;
  onOpenFallback?: () => void;
}

export function LoadingScreen({
  isSceneReady,
  loadError,
  onOpenFallback,
}: LoadingScreenProps) {
  const { active, progress, errors } = useProgress();
  const [hidden, setHidden] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const isComplete = isSceneReady && !active && clampedProgress >= 100;
  const combinedError =
    loadError?.message || (errors.length > 0 ? errors[0] : null);

  useEffect(() => {
    if (!isComplete || combinedError || !overlayRef.current) return;

    const tween = gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.65,
      ease: 'power2.out',
      onComplete: () => setHidden(true),
    });

    return () => {
      tween.kill();
    };
  }, [isComplete, combinedError]);

  if (hidden && !combinedError) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#120b07] p-6"
    >
      <div className="wood-walnut wood-panel-shadow w-full max-w-md rounded-2xl border-[3px] border-[#b47c3c] p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#ffd27d]/80 bg-gradient-to-b from-[#eda136] to-[#b56310] text-[#fff8e8] shadow-lg">
          <Flame className="h-7 w-7 animate-pulse" />
        </div>

        <h1 className="font-display wood-text-shadow mt-4 text-2xl font-bold text-[#fff5df]">
          Adventure Workshop
        </h1>

        {combinedError ? (
          <div className="mt-4 space-y-4">
            <p className="rounded-xl border border-red-400/40 bg-red-950/50 p-3 text-sm text-red-200">
              {combinedError}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="wood-plank-active cursor-pointer rounded-xl border-2 border-[#ffd27d] px-5 py-2 text-sm font-bold text-[#fff8e8] transition hover:brightness-110"
              >
                Retry Loading
              </button>
              {onOpenFallback && (
                <button
                  type="button"
                  onClick={onOpenFallback}
                  className="wood-plank-idle cursor-pointer rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-sm font-bold text-[#ffefc6] transition hover:border-[#ffd27d] hover:brightness-110"
                >
                  Open 2D Workshop
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1.5 text-sm text-[#e4cfa9]">
              {clampedProgress < 100
                ? 'Lighting the hearth and unpacking the workshop...'
                : 'Preparing materials and shadows...'}
            </p>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="h-4 w-full overflow-hidden rounded-full border-2 border-[#7b4f21] bg-[#1e1008] p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d47a16] via-[#f2ab3e] to-[#ffe08a] transition-all duration-200 ease-out"
                  style={{ width: `${clampedProgress}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs font-bold tracking-wider text-[#f3cf8d]">
                <span>LOADING 3D SCENE</span>
                <span>{clampedProgress}%</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
