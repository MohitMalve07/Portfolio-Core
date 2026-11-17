import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  type AudioStateSnapshot,
  workshopAudio,
} from '../../utils/workshopAudio';

/**
 * Compact wooden HUD button at the bottom-left for toggling ambient BGM,
 * fireplace crackle, and UI click sounds.
 */
export function AudioToggle() {
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
      className="wood-walnut wood-panel-shadow fixed bottom-4 left-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#c8934b] px-3.5 py-2 text-xs font-bold text-[#ffefc6] transition hover:scale-[1.03] hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px md:bottom-5 xl:left-7"
    >
      {audioState.isMuted ? (
        <VolumeX className="h-4 w-4 text-[#c99b68]" />
      ) : (
        <Volume2 className="h-4 w-4 text-[#f5b951]" />
      )}
      <span className="font-display game-label-shadow tracking-wide">
        {label}
      </span>
      {!audioState.isMuted && !audioState.isUnlocked && (
        <span
          aria-hidden="true"
          className="h-2 w-2 animate-pulse rounded-full bg-[#ffcf56] shadow-[0_0_8px_rgba(255,207,86,0.9)]"
        />
      )}
    </button>
  );
}
