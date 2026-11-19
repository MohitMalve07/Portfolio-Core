interface TabOption<T extends string> {
  id: T;
  label: string;
}

interface MobileItemTabsProps<T extends string> {
  options: readonly TabOption<T>[];
  activeId: T;
  onSelect: (id: T) => void;
}

/**
 * Compact mobile-only switcher bar inside detail cards so phone visitors
 * can step through all trophies, projects, or skill branches in 1 tap.
 */
export function MobileItemTabs<T extends string>({
  options,
  activeId,
  onSelect,
}: MobileItemTabsProps<T>) {
  return (
    <div className="relative mt-2.5 flex flex-wrap gap-1.5 border-b border-[#8e5d29]/45 pb-2.5 md:hidden">
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            aria-pressed={isActive}
            className={[
              'cursor-pointer rounded-lg border px-2.5 py-1.5 text-[13px] font-bold leading-none transition active:translate-y-px',
              isActive
                ? 'wood-plank-active border-[#ffe08a] text-[#fff8e8]'
                : 'wood-plank-idle border-[#b47c3c] text-[#f5dfb8]',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
