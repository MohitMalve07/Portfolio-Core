import { useId } from 'react';
import type { NavigationItem } from '../../data/navigation';

interface MenuIconProps {
  name: NavigationItem['iconName'];
  className?: string;
}

/**
 * Hand-crafted illustrated fantasy game icons matching the chunky,
 * warm, shaded aesthetic of the Adventure Workshop menu reference.
 */
export function MenuIcon({ name, className = 'h-10 w-10' }: MenuIconProps) {
  const uid = useId().replace(/:/g, '');

  switch (name) {
    case 'id-card':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`cardBg-${uid}`} x1="6" y1="12" x2="42" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff0d4" />
              <stop offset="1" stopColor="#deb88b" />
            </linearGradient>
            <linearGradient id={`clip-${uid}`} x1="24" y1="6" x2="24" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#eb7d4b" />
              <stop offset="1" stopColor="#a94520" />
            </linearGradient>
          </defs>
          {/* Drop shadow */}
          <rect x="6" y="13.5" width="36" height="27" rx="4.5" fill="#1d0d05" fillOpacity="0.45" />
          {/* Card body */}
          <rect x="6" y="11.5" width="36" height="27" rx="4.5" fill={`url(#cardBg-${uid})`} stroke="#3b1d0c" strokeWidth="2.4" />
          {/* Inner highlight */}
          <rect x="8.2" y="13.7" width="31.6" height="22.6" rx="2.6" stroke="#fff8ea" strokeOpacity="0.65" strokeWidth="1" />
          {/* Top lanyard clip */}
          <rect x="20.5" y="6.5" width="7" height="9" rx="2" fill={`url(#clip-${uid})`} stroke="#3b1d0c" strokeWidth="2" />
          <circle cx="24" cy="9.5" r="1.1" fill="#fff2dc" />
          {/* Character portrait frame */}
          <rect x="10.5" y="18" width="12.5" height="14.5" rx="2" fill="#63879c" stroke="#3b1d0c" strokeWidth="1.8" />
          {/* Character head & shoulders */}
          <circle cx="16.75" cy="23" r="3" fill="#2c4454" />
          <path d="M12.2 31.5C12.7 28.4 14.5 27.2 16.75 27.2C19 27.2 20.8 28.4 21.3 31.5" fill="#2c4454" />
          {/* Info lines */}
          <rect x="26" y="19.5" width="11.5" height="2.6" rx="1.3" fill="#6f4728" />
          <rect x="26" y="24.2" width="11.5" height="2.4" rx="1.2" fill="#8b5d38" />
          <rect x="26" y="28.8" width="8.2" height="2.4" rx="1.2" fill="#8b5d38" />
        </svg>
      );

    case 'briefcase':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`caseTop-${uid}`} x1="24" y1="14" x2="24" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92542f" />
              <stop offset="1" stopColor="#6b381b" />
            </linearGradient>
            <linearGradient id={`caseBot-${uid}`} x1="24" y1="23" x2="24" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6a381c" />
              <stop offset="1" stopColor="#46220e" />
            </linearGradient>
            <linearGradient id={`clasp-${uid}`} x1="24" y1="23" x2="24" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffe178" />
              <stop offset="1" stopColor="#c98018" />
            </linearGradient>
          </defs>
          {/* Drop shadow */}
          <rect x="6.5" y="16" width="35" height="25.5" rx="4.5" fill="#1d0d05" fillOpacity="0.45" />
          {/* Top handle */}
          <path d="M17.5 14.5V11C17.5 9.6 18.6 8.5 20 8.5H28C29.4 8.5 30.5 9.6 30.5 11V14.5" stroke="#3b1d0c" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M17.5 14.5V11C17.5 9.6 18.6 8.5 20 8.5H28C29.4 8.5 30.5 9.6 30.5 11V14.5" stroke="#7f4624" strokeWidth="2.4" strokeLinecap="round" />
          {/* Lower briefcase body */}
          <rect x="6.5" y="15" width="35" height="24.5" rx="4.5" fill={`url(#caseBot-${uid})`} stroke="#331708" strokeWidth="2.4" />
          {/* Top flap */}
          <path d="M6.5 19.5C6.5 17 8.5 15 11 15H37C39.5 15 41.5 17 41.5 19.5V24.2C41.5 26 40 27.3 38.2 27.3H9.8C8 27.3 6.5 26 6.5 24.2V19.5Z" fill={`url(#caseTop-${uid})`} stroke="#331708" strokeWidth="2.2" />
          {/* Flap highlight */}
          <path d="M9.5 17.3H38.5" stroke="#c37d4e" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
          {/* Golden clasp */}
          <rect x="20.2" y="23" width="7.6" height="7" rx="1.6" fill={`url(#clasp-${uid})`} stroke="#3b1d0c" strokeWidth="2" />
          <circle cx="24" cy="26.5" r="1" fill="#4f290e" />
        </svg>
      );

    case 'hammer':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`folder-${uid}`} x1="24" y1="15" x2="24" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d89452" />
              <stop offset="1" stopColor="#9f5f27" />
            </linearGradient>
            <linearGradient id={`steel-${uid}`} x1="17" y1="9" x2="32" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#dce7f2" />
              <stop offset="0.55" stopColor="#98abb9" />
              <stop offset="1" stopColor="#677987" />
            </linearGradient>
            <linearGradient id={`handle-${uid}`} x1="12" y1="36" x2="26" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9e5a2b" />
              <stop offset="1" stopColor="#6c3917" />
            </linearGradient>
          </defs>
          {/* Subtle workbench folder backing (matches reference silhouette) */}
          <path d="M8 18C8 16.3 9.3 15 11 15H19L22 18.2H37C38.7 18.2 40 19.5 40 21.2V36C40 37.7 38.7 39 37 39H11C9.3 39 8 37.7 8 36V18Z" fill={`url(#folder-${uid})`} stroke="#3b1d0c" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M9.5 21.5H38.5V35.8C38.5 36.8 37.8 37.5 36.8 37.5H11.2C10.2 37.5 9.5 36.8 9.5 35.8V21.5Z" fill="#b77236" fillOpacity="0.55" />
          {/* Hammer handle */}
          <path d="M12.5 36.8L25.5 19.2L29.5 22.2L16.5 39.8C15.5 41 13.8 41.2 12.7 40.3C11.6 39.4 11.5 37.9 12.5 36.8Z" fill={`url(#handle-${uid})`} stroke="#2b1307" strokeWidth="2.2" strokeLinejoin="round" />
          {/* Hammer steel head + claw */}
          <path d="M16.5 14.5L21.8 9.2C24.2 8.8 27.6 10.1 30.8 12.6L35 15.8L31.4 20.5L27.8 17.8L24.8 21.8L20.4 18.5L22.1 16.2L18.5 16.2L16.5 14.5Z" fill={`url(#steel-${uid})`} stroke="#242e38" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M21.5 11.4L29.6 14.2" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    case 'sword':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`bladeA-${uid}`} x1="10" y1="8" x2="36" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#eef5fc" />
              <stop offset="0.5" stopColor="#a6bac9" />
              <stop offset="1" stopColor="#6f8394" />
            </linearGradient>
            <linearGradient id={`star-${uid}`} x1="34" y1="24" x2="34" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffe56b" />
              <stop offset="1" stopColor="#df8b12" />
            </linearGradient>
          </defs>
          {/* Back sword (top-left to bottom-right) */}
          <path d="M10.5 9.5L16.5 10.5L32.8 26.8L29.2 30.4L12.9 14.1L10.5 9.5Z" fill={`url(#bladeA-${uid})`} stroke="#232c35" strokeWidth="2.1" strokeLinejoin="round" />
          <path d="M26.5 31.8L32.8 25.5" stroke="#c9862b" strokeWidth="4.4" strokeLinecap="round" />
          <path d="M26.5 31.8L32.8 25.5" stroke="#3b1d0c" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
          <path d="M31.2 28.8L35.5 33.1" stroke="#3b1d0c" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M31.2 28.8L35.5 33.1" stroke="#8a4b22" strokeWidth="2.4" strokeLinecap="round" />

          {/* Front sword (bottom-left to top-right) */}
          <path d="M37.5 9.5L31.5 10.5L15.2 26.8L18.8 30.4L35.1 14.1L37.5 9.5Z" fill={`url(#bladeA-${uid})`} stroke="#232c35" strokeWidth="2.1" strokeLinejoin="round" />
          <path d="M35.2 11.4L17.4 29.2" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
          {/* Hilt & crossguard */}
          <path d="M14.4 25.2L20.8 31.6" stroke="#3b1d0c" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M14.4 25.2L20.8 31.6" stroke="#e4a948" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M16.5 29.5L11.8 34.2" stroke="#3b1d0c" strokeWidth="4.8" strokeLinecap="round" />
          <path d="M16.5 29.5L11.8 34.2" stroke="#8a4b22" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="10.8" cy="35.2" r="2.6" fill="#e4a948" stroke="#3b1d0c" strokeWidth="1.8" />

          {/* Golden Star badge in foreground */}
          <path
            d="M34.5 24.5L37 29.6L42.6 30.4L38.5 34.3L39.5 39.8L34.5 37.2L29.5 39.8L30.5 34.3L26.4 30.4L32 29.6L34.5 24.5Z"
            fill={`url(#star-${uid})`}
            stroke="#3b1d0c"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <path
            d="M34.5 26.8L36 30.2L39.6 30.8"
            stroke="#fff7c2"
            strokeOpacity="0.7"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'mail':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`envBack-${uid}`} x1="24" y1="16" x2="24" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d9a166" />
              <stop offset="1" stopColor="#b0753d" />
            </linearGradient>
            <linearGradient id={`envFront-${uid}`} x1="24" y1="24" x2="24" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#efc38e" />
              <stop offset="1" stopColor="#c98e52" />
            </linearGradient>
          </defs>
          {/* Drop shadow */}
          <rect x="7" y="18.5" width="34" height="22" rx="3.2" fill="#1d0d05" fillOpacity="0.45" />
          {/* Back open flap */}
          <path d="M8 18.5L24 9.5L40 18.5V36.5C40 37.9 38.9 39 37.5 39H10.5C9.1 39 8 37.9 8 36.5V18.5Z" fill={`url(#envBack-${uid})`} stroke="#3b1d0c" strokeWidth="2.2" strokeLinejoin="round" />
          {/* Cream letter inside */}
          <rect x="13" y="11" width="22" height="19" rx="2" fill="#fff5de" stroke="#3b1d0c" strokeWidth="2" />
          <rect x="16.8" y="15.2" width="14.4" height="2.2" rx="1.1" fill="#d97a54" />
          <rect x="16.8" y="19.4" width="14.4" height="2" rx="1" fill="#c99364" />
          <rect x="16.8" y="23.4" width="9.8" height="2" rx="1" fill="#c99364" />
          {/* Front envelope pocket folds */}
          <path d="M8 19.2L24 29.8L40 19.2V36.5C40 37.9 38.9 39 37.5 39H10.5C9.1 39 8 37.9 8 36.5V19.2Z" fill={`url(#envFront-${uid})`} stroke="#3b1d0c" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M9.5 37.4L20.5 27.6M38.5 37.4L27.5 27.6" stroke="#7d4920" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}
