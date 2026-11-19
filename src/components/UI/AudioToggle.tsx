import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  type AudioStateSnapshot,
  workshopAudio,
} from '../../utils/workshopAudio';

interface AudioToggleProps {
  /** Compact inline icon button used in the mobile top bar to keep the bottom clear. */
  compact?: boolean;
  className?: string;
}

/**
 * Compact wooden HUD button for toggling ambient BGM, fireplace crackle,
 * and UI click sounds.
 */
export function AudioToggle({
  compact = false,
  className = '',
}: AudioToggleProps) {
  const [audioState, setAudioState] = useState<AudioStateSnapshot>(() =>
    workshopAudio.getSnapshot(),
  );

  useEffect(() => {
    return workshopAudio.subscribe(setAudioState);
  }, []);

  const isPlaying = audioState.isUnlocked && !audioState.isMuted;
  const label = audioState.isMuted
    ? 'Sound Off'
    : isPlaying
      ? 'Sound On'
      : 'Enable Sound';
  const ariaLabel = audioState.isMuted
    ? 'Unmute workshop audio'
    : isPlaying
      ? 'Mute workshop audio'
      : 'Enable workshop audio';

  return (
    <button
      type="button"
      data-audio-toggle="true"
      onClick={() => workshopAudio.toggleMute()}
      aria-pressed={isPlaying}
      aria-label={ariaLabel}
      title={
        audioState.isMuted
          ? 'Turn on ambient music, fire crackle, and click sounds'
          : 'Mute ambient music, fire crackle, and click sounds'
      }
      className={[
        'wood-walnut wood-panel-shadow cursor-pointer items-center rounded-xl border-2 border-[#c8934b] text-xs font-bold text-[#ffefc6] transition hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px',
        compact
          ? 'inline-flex h-8.5 justify-center gap-1.5 px-2.5'
          : 'fixed bottom-5 left-4 z-30 hidden gap-2 px-3.5 py-2 hover:scale-[1.03] md:inline-flex xl:left-7',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {audioState.isMuted ? (
        <VolumeX className="h-4 w-4 text-[#c99b68]" />
      ) : (
        <Volume2 className="h-4 w-4 text-[#f5b951]" />
      )}
      {!compact && (
        <span className="font-display game-label-shadow tracking-wide">
          {label}
        </span>
      )}
      {!audioState.isMuted && !audioState.isUnlocked && (
        <span
          aria-hidden="true"
          className="h-2 w-2 animate-pulse rounded-full bg-[#ffcf56] shadow-[0_0_8px_rgba(255,207,86,0.9)]"
        />
      )}
    </button>
  );
}
