import { useEffect, useId, useRef } from 'react';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
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

/**
 * Physical warm-ivory paper note sized to ~65-75% of BackWall_Corkboard's usable
 * area and anchored directly onto the corkboard in 3D world space.
 */
export function AboutMeCard({ visible }: AboutMeCardProps) {
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !noteRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        noteRef.current,
        { opacity: 0, y: -10, scale: 0.96, rotation: 4.0 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 2.2,
          duration: 0.45,
          ease: 'power3.out',
        },
      );
    }, noteRef);

    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null;

  return (
    <Html
      transform
      distanceFactor={0.27}
      position={ABOUT_ME_CARD_ANCHOR}
      zIndexRange={[20, 0]}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        ref={noteRef}
        role="article"
        aria-label="About Mohit Malve — pinned corkboard note"
        className="relative w-[460px] select-text drop-shadow-[2px_8px_11px_rgba(18,8,2,0.5)]"
      >
        <PaperclipBack />

        {/* Aged ivory paper sheet (~0.54m x 0.34m in world space) */}
        <div className="paper-note-surface font-handwritten relative z-10 px-6 pb-4.5 pt-5.5 text-[#2b1a0e] shadow-[inset_0_0_24px_rgba(139,98,52,0.22),inset_0_1px_0_rgba(255,255,255,0.65)]">
          {/* Subtle curled corner shadow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 bg-gradient-to-tl from-[#bfa57a]/45 via-transparent to-transparent"
          />

          <header className="mb-2.5">
            <h2 className="text-[26px] font-bold leading-none tracking-tight text-[#231207]">
              Mohit Malve
            </h2>
            <p className="mt-0.5 text-[15.5px] font-semibold leading-snug text-[#462a16]">
              Gameplay Programmer | Unity, C#, Online Multiplayer
            </p>
          </header>

          <p className="mb-2.5 text-[15.5px] leading-[1.28] text-[#2e1c0f]">
            Gameplay programmer focused on online co-op and vehicle gameplay in
            Unity. Built, tested and shipped a cross-play web and Windows co-op
            driving game to external playtesters.
          </p>

          <ul className="space-y-0.5 text-[15px] leading-[1.25] text-[#2b1a0e]">
            <li>- Location: Pune, India</li>
            <li>- Education: B.Tech in Computer Engineering</li>
            <li>
              - University: Vishwakarma Institute of Information Technology, Pune
            </li>
            <li>- CGPA: 8.51</li>
            <li>
              - Certification: Unity Certified Associate: Programmer (2026)
            </li>
          </ul>
        </div>

        <PaperclipFront />
      </div>
    </Html>
  );
}
