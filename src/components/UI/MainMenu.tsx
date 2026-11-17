import { useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAVIGATION_ITEMS, type SectionId } from '../../data/navigation';
import { NavigationButton } from './NavigationButton';

interface MainMenuProps {
  activeSection: SectionId | null;
  onSelectSection: (id: SectionId) => void;
}

/**
 * Carved golden-tan wooden L-bracket ornament with two tucked olive leaves,
 * matching the four corners of the adventure-game wooden menu panel.
 */
function CornerOrnament({ className }: { className: string }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={`pointer-events-none absolute z-20 h-13 w-13 drop-shadow-[0_3px_4px_rgba(8,3,1,0.72)] ${className}`}
      fill="none"
    >
      <defs>
        <linearGradient id={`ornWood-${uid}`} x1="6" y1="6" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8ba7a" />
          <stop offset="0.5" stopColor="#b98345" />
          <stop offset="1" stopColor="#7c4e22" />
        </linearGradient>
        <linearGradient id={`leaf-${uid}`} x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9ec257" />
          <stop offset="1" stopColor="#5a7d28" />
        </linearGradient>
      </defs>

      {/* Top horizontal tucked leaf */}
      <path
        d="M32 10C37 4 46 4 53 10C46 15 38 15 32 10Z"
        fill={`url(#leaf-${uid})`}
        stroke="#273a10"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="M35 10H49" stroke="#c8e382" strokeOpacity="0.65" strokeWidth="1.2" strokeLinecap="round" />

      {/* Left vertical tucked leaf */}
      <path
        d="M10 32C4 37 4 46 10 53C15 46 15 38 10 32Z"
        fill={`url(#leaf-${uid})`}
        stroke="#273a10"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="M10 35V49" stroke="#c8e382" strokeOpacity="0.65" strokeWidth="1.2" strokeLinecap="round" />

      {/* Stepped golden-tan carved wooden corner bracket */}
      <path
        d="M6 39V11C6 8.2 8.2 6 11 6H39V17H22L17 22V39H6Z"
        fill={`url(#ornWood-${uid})`}
        stroke="#261207"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* Corner cap square & inner bevel */}
      <path
        d="M7.5 18.5H18.5V7.5"
        stroke="#573114"
        strokeOpacity="0.55"
        strokeWidth="1.6"
      />
      <path
        d="M9 36V12.5C9 10.6 10.6 9 12.5 9H36"
        stroke="#ffe3ac"
        strokeOpacity="0.72"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MainMenu({ activeSection, onSelectSection }: MainMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: SectionId) => {
    onSelectSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile / small screen toggle button */}
      <div className="fixed left-4 top-4 z-30 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close workshop menu' : 'Open workshop menu'}
          className="wood-walnut wood-panel-shadow flex items-center gap-2 rounded-xl border-2 border-[#c68f48] px-3.5 py-2 text-sm font-bold text-[#ffefc6] transition hover:brightness-110"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="font-display game-label-shadow tracking-wide">Workshop Menu</span>
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Left-side Physical Wooden Game-Menu Panel */}
      <nav
        aria-label="Workshop Main Menu"
        className={[
          'fixed z-30 transition-all duration-300 ease-out',
          // Desktop: left-side placement keeping center workstation & fireplace hearth visible
          'md:left-4 md:top-1/2 md:w-[290px] md:-translate-y-1/2 md:translate-x-0 md:opacity-100 xl:left-7 xl:w-[322px]',
          // Mobile: collapsible wooden board drawer
          mobileOpen
            ? 'left-4 top-16 w-[min(88vw,312px)] translate-x-0 opacity-100'
            : 'pointer-events-none left-4 top-16 w-[min(88vw,312px)] -translate-x-6 opacity-0 md:pointer-events-auto',
        ].join(' ')}
      >
        {/* Outer wooden rim & dark carved border */}
        <div className="wood-panel-shadow relative rounded-xl border-[3px] border-[#211007] bg-gradient-to-b from-[#8b5c34] via-[#5e3a1f] to-[#3c2211] p-[7px]">
          {/* Outer rim bevel highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[2px] rounded-[9px] border border-[#d6a365]/40"
          />

          {/* Recessed dark walnut interior board */}
          <div className="wood-walnut relative rounded-lg border-2 border-[#231107] px-3.5 py-4.5 shadow-[inset_0_8px_18px_rgba(10,4,1,0.75)] sm:px-4 sm:py-5">
            {/* Subtle recessed inner molding line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[4px] rounded-md border border-[#966233]/25"
            />

            {/* Four carved golden wooden corner ornaments + leaves */}
            <CornerOrnament className="-left-3.5 -top-3.5" />
            <CornerOrnament className="-right-3.5 -top-3.5 scale-x-[-1]" />
            <CornerOrnament className="-bottom-3.5 -left-3.5 scale-y-[-1]" />
            <CornerOrnament className="-bottom-3.5 -right-3.5 scale-[-1]" />

            {/* Vertically stacked chunky wooden buttons */}
            <ul className="relative z-10 flex flex-col gap-3.5">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.id}>
                  <NavigationButton
                    item={item}
                    isActive={activeSection === item.id}
                    onSelect={handleSelect}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
