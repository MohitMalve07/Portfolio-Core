import { useId } from 'react';
import type { NavigationItem, SectionId } from '../../data/navigation';
import { MenuIcon } from './MenuIcons';

interface NavigationButtonProps {
  item: NavigationItem;
  isActive: boolean;
  onSelect: (id: SectionId) => void;
}

/**
 * Chunky, chamfered-corner wooden button with layered 3D golden bevels,
 * recessed dark walnut / amber plank center, wood-grain texture, and illustrated icon.
 */
export function NavigationButton({
  item,
  isActive,
  onSelect,
}: NavigationButtonProps) {
  const uid = useId().replace(/:/g, '');

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={isActive}
      className={[
        'group relative flex h-[64px] w-full cursor-pointer items-center gap-3.5 px-4 text-left select-none lg:h-[68px] lg:px-4.5',
        'transition-all duration-200 ease-out focus:outline-none',
        isActive
          ? 'scale-[1.02] drop-shadow-[0_0_16px_rgba(244,167,46,0.45)]'
          : 'drop-shadow-[0_6px_8px_rgba(8,3,1,0.72)] hover:scale-[1.025] hover:drop-shadow-[0_0_14px_rgba(235,179,90,0.38)]',
        'active:translate-y-[2px] active:scale-[0.985]',
      ].join(' ')}
    >
      {/* Layered 3D Chamfered Wooden Button Frame (SVG) */}
      <svg
        viewBox="0 0 280 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          {/* Outer golden-tan frame gradient */}
          <linearGradient id={`frameBody-${uid}`} x1="0" y1="0" x2="0" y2="72" gradientUnits="userSpaceOnUse">
            {isActive ? (
              <>
                <stop offset="0" stopColor="#ffe79e" />
                <stop offset="0.45" stopColor="#e5aa48" />
                <stop offset="1" stopColor="#9b5f19" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#ebd09a" />
                <stop offset="0.45" stopColor="#c59454" />
                <stop offset="1" stopColor="#7a4e21" />
              </>
            )}
          </linearGradient>

          {/* Top bevel catchlight */}
          <linearGradient id={`bevelTop-${uid}`} x1="0" y1="2" x2="0" y2="11" gradientUnits="userSpaceOnUse">
            <stop stopColor={isActive ? '#fff7cf' : '#f7dfb1'} />
            <stop offset="1" stopColor={isActive ? '#f2ba58' : '#d6a664'} />
          </linearGradient>

          {/* Bottom bevel shadow */}
          <linearGradient id={`bevelBot-${uid}`} x1="0" y1="61" x2="0" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor={isActive ? '#b56e1b' : '#966430'} />
            <stop offset="1" stopColor={isActive ? '#7b430b' : '#5e3915'} />
          </linearGradient>

          {/* Recessed center wood plank */}
          <linearGradient id={`centerWood-${uid}`} x1="0" y1="10" x2="0" y2="62" gradientUnits="userSpaceOnUse">
            {isActive ? (
              <>
                <stop offset="0" stopColor="#f3ab38" />
                <stop offset="0.52" stopColor="#d87f17" />
                <stop offset="1" stopColor="#a8510b" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#4c3224" />
                <stop offset="0.55" stopColor="#3c2519" />
                <stop offset="1" stopColor="#2c1a11" />
              </>
            )}
          </linearGradient>

          {/* Inner top shadow on the recessed wood */}
          <linearGradient id={`innerShade-${uid}`} x1="0" y1="10" x2="0" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0f0602" stopOpacity="0.58" />
            <stop offset="0.22" stopColor="#0f0602" stopOpacity="0.06" />
            <stop offset="0.82" stopColor="#0f0602" stopOpacity="0" />
            <stop offset="1" stopColor="#0f0602" stopOpacity="0.35" />
          </linearGradient>

          {/* Subtle horizontal wood grain overlay */}
          <pattern id={`grain-${uid}`} width="64" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 3H64M0 8.5H64" stroke={isActive ? '#fff2c4' : '#e6b882'} strokeOpacity={isActive ? '0.08' : '0.045'} strokeWidth="1" />
            <path d="M8 6H44M20 11H58" stroke="#140803" strokeOpacity="0.16" strokeWidth="1" />
          </pattern>
        </defs>

        {/* 1. Outer dark espresso outline */}
        <polygon
          points="14,1.5 266,1.5 278.5,14 278.5,58 266,70.5 14,70.5 1.5,58 1.5,14"
          fill="#1b0d05"
        />

        {/* 2. Thick beveled golden/tan outer molding */}
        <polygon
          points="15,3.5 265,3.5 276.5,15 276.5,57 265,68.5 15,68.5 3.5,57 3.5,15"
          fill={`url(#frameBody-${uid})`}
        />

        {/* Top bevel facet */}
        <polygon
          points="15,3.5 265,3.5 261,10.5 19,10.5"
          fill={`url(#bevelTop-${uid})`}
        />

        {/* Bottom bevel facet */}
        <polygon
          points="19,61.5 261,61.5 265,68.5 15,68.5"
          fill={`url(#bevelBot-${uid})`}
        />

        {/* Miter joint grooves on all 8 chamfered corners for carved wood carpentry look */}
        <g stroke="#4a2910" strokeOpacity="0.52" strokeWidth="1.2">
          <line x1="15" y1="3.5" x2="19" y2="10.5" />
          <line x1="3.5" y1="15" x2="11" y2="19" />
          <line x1="265" y1="3.5" x2="261" y2="10.5" />
          <line x1="276.5" y1="15" x2="269" y2="19" />
          <line x1="3.5" y1="57" x2="11" y2="53" />
          <line x1="15" y1="68.5" x2="19" y2="61.5" />
          <line x1="276.5" y1="57" x2="269" y2="53" />
          <line x1="265" y1="68.5" x2="261" y2="61.5" />
        </g>

        {/* Crisp top inner highlight on bevel */}
        <polyline
          points="4.8,56 4.8,15.5 15.5,4.8 264.5,4.8 275.2,15.5"
          fill="none"
          stroke={isActive ? '#fffbe3' : '#ffebc2'}
          strokeOpacity="0.65"
          strokeWidth="1.2"
        />

        {/* 3. Dark carved recess outline around inner wood plank */}
        <polygon
          points="19,10 261,10 270,19 270,53 261,62 19,62 10,53 10,19"
          fill="#1f0e06"
        />

        {/* 4. Sunken wooden plank center */}
        <polygon
          points="20,11.5 260,11.5 268.5,20 268.5,52 260,60.5 20,60.5 11.5,52 11.5,20"
          fill={`url(#centerWood-${uid})`}
          className="transition-opacity duration-200"
        />

        {/* Hover warm tint overlay */}
        {!isActive && (
          <polygon
            points="20,11.5 260,11.5 268.5,20 268.5,52 260,60.5 20,60.5 11.5,52 11.5,20"
            fill="#8c5429"
            className="opacity-0 transition-opacity duration-200 group-hover:opacity-35"
          />
        )}

        {/* Wood grain texture */}
        <polygon
          points="20,11.5 260,11.5 268.5,20 268.5,52 260,60.5 20,60.5 11.5,52 11.5,20"
          fill={`url(#grain-${uid})`}
        />

        {/* Inner recessed shadow */}
        <polygon
          points="20,11.5 260,11.5 268.5,20 268.5,52 260,60.5 20,60.5 11.5,52 11.5,20"
          fill={`url(#innerShade-${uid})`}
        />
      </svg>

      {/* Button foreground: Illustrated icon + bold outlined label */}
      <span className="relative z-10 flex shrink-0 items-center justify-center pl-1 transition-transform duration-200 group-hover:scale-105">
        <MenuIcon name={item.iconName} className="h-9 w-9 lg:h-10 lg:w-10" />
      </span>

      <span
        className={[
          'font-display game-label-shadow relative z-10 text-[1.2rem] font-bold tracking-[0.015em] lg:text-[1.34rem]',
          isActive
            ? 'text-[#fff9e6]'
            : 'text-[#ffefc6] group-hover:text-[#fff7dc]',
        ].join(' ')}
      >
        {item.order}. {item.label}
      </span>
    </button>
  );
}
