import { useEffect, useId, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ABOUT_ME_CONTENT } from '../../data/about';
import { ABOUT_ME_CARD_ANCHOR } from '../../data/cameraAnchors';

interface AboutMeCardProps {
  visible: boolean;
  onClose?: () => void;
}

/**
 * Proportionally scaled metallic paperclip split so the back loop tucks behind
 * the top edge of the note while the front loop clamps onto the paper face.
 */
function PaperclipBack() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 76"
      className="pointer-events-none absolute -top-5 left-1/2 z-0 h-10 w-6 -translate-x-1/2 -rotate-[7deg]"
      fill="none"
    >
      <path
        d="M11 42V15C11 7.8 16.4 3 23 3C29.6 3 34.5 7.8 34.5 15V46"
        stroke="#4f5661"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      <path
        d="M11 42V15C11 7.8 16.4 3 23 3C29.6 3 34.5 7.8 34.5 15V46"
        stroke="#b4bcc7"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PaperclipFront() {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 76"
      className="pointer-events-none absolute -top-5 left-1/2 z-20 h-10 w-6 -translate-x-1/2 -rotate-[7deg] drop-shadow-[1px_2px_2px_rgba(32,16,6,0.42)]"
      fill="none"
    >
      <defs>
        <linearGradient id={`clipMetal-${uid}`} x1="10" y1="6" x2="32" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#eef2f6" />
          <stop offset="0.45" stopColor="#9aa3af" />
          <stop offset="1" stopColor="#5a626e" />
        </linearGradient>
      </defs>
      <path
        d="M11 22V56C11 63.8 16.2 69 22.8 69C29.4 69 34.5 63.8 34.5 56V20C34.5 14.2 30.2 10 24.8 10C19.6 10 15.8 14.2 15.8 20V50C15.8 53.6 18.6 56.2 21.8 56.2C25.2 56.2 27.8 53.6 27.8 50V22"
        stroke="#393f47"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      <path
        d="M11 22V56C11 63.8 16.2 69 22.8 69C29.4 69 34.5 63.8 34.5 56V20C34.5 14.2 30.2 10 24.8 10C19.6 10 15.8 14.2 15.8 20V50C15.8 53.6 18.6 56.2 21.8 56.2C25.2 56.2 27.8 53.6 27.8 50V22"
        stroke={`url(#clipMetal-${uid})`}
        strokeWidth="2.9"
        strokeLinecap="round"
      />
      <path
        d="M15.8 22V48M27.8 24V48"
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface AboutMePaperNoteProps {
  visible: boolean;
  rotation?: number;
  className?: string;
}

/**
 * Shared warm-ivory handwritten note with metallic paperclip used both on the
 * 3D desktop corkboard and as a readable mobile overlay below 768px.
 */
export function AboutMePaperNote({
  visible,
  rotation = 2.2,
  className = 'w-[460px]',
}: AboutMePaperNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !noteRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        noteRef.current,
        { opacity: 0, y: -10, scale: 0.96, rotation: rotation + 1.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation,
          duration: 0.45,
          ease: 'power3.out',
        },
      );
    }, noteRef);

    return () => ctx.revert();
  }, [visible, rotation]);

  if (!visible) return null;

  return (
    <div
      ref={noteRef}
      role="article"
      aria-label="About Mohit Malve — pinned corkboard note"
      className={`relative select-text drop-shadow-[2px_8px_11px_rgba(18,8,2,0.5)] ${className}`}
    >
      <PaperclipBack />

      {/* Aged ivory paper sheet */}
      <div className="paper-note-surface font-handwritten relative z-10 px-5 pb-4 pt-5 text-[#2b1a0e] shadow-[inset_0_0_24px_rgba(139,98,52,0.22),inset_0_1px_0_rgba(255,255,255,0.65)] sm:px-6 sm:pb-4.5 sm:pt-5.5">
        {/* Subtle curled corner shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 bg-gradient-to-tl from-[#bfa57a]/45 via-transparent to-transparent"
        />

        <header className="mb-2.5">
          <h2 className="text-[26px] font-bold leading-none tracking-tight text-[#231207]">
            {ABOUT_ME_CONTENT.name}
          </h2>
          <p className="mt-0.5 text-[16.5px] font-semibold leading-snug text-[#462a16] md:text-[15.5px]">
            {ABOUT_ME_CONTENT.headline}
          </p>
        </header>

        <p className="mb-2.5 text-[16.5px] leading-[1.32] text-[#2e1c0f] md:text-[15.5px] md:leading-[1.28]">
          {ABOUT_ME_CONTENT.summary}
        </p>

        <ul className="space-y-1 text-[15.5px] leading-[1.28] text-[#2b1a0e] md:space-y-0.5 md:text-[15px] md:leading-[1.25]">
          {ABOUT_ME_CONTENT.facts.map((fact) => (
            <li key={fact}>- {fact}</li>
          ))}
        </ul>
      </div>

      <PaperclipFront />
    </div>
  );
}

/**
 * Physical warm-ivory paper note anchored onto BackWall_Corkboard in 3D space
 * on tablet/desktop viewports (mobile < 768px renders a crisp floating overlay).
 */
export function AboutMeCard({ visible }: AboutMeCardProps) {
  const viewportWidth = useThree((s) => s.size.width);

  if (!visible || viewportWidth < 768) return null;

  return (
    <Html
      transform
      distanceFactor={0.27}
      position={ABOUT_ME_CARD_ANCHOR}
      zIndexRange={[20, 0]}
      style={{ pointerEvents: 'auto' }}
    >
      <AboutMePaperNote visible={visible} />
    </Html>
  );
}
