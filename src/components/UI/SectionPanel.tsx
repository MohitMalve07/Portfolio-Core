import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Briefcase, Hammer, IdCard, Mail, Sparkles, Sword, X } from 'lucide-react';
import type { NavigationItem } from '../../data/navigation';

interface SectionPanelProps {
  item: NavigationItem | null;
  onClose: () => void;
}

const ICON_MAP = {
  'id-card': IdCard,
  briefcase: Briefcase,
  hammer: Hammer,
  sword: Sword,
  mail: Mail,
} as const;

export function SectionPanel({ item, onClose }: SectionPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item || !panelRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: 28, scale: 0.97 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.34,
          ease: 'power3.out',
        },
      );
    }, panelRef);

    return () => ctx.revert();
  }, [item?.id]);

  if (!item) return null;

  const Icon = ICON_MAP[item.iconName];

  return (
    <aside
      ref={panelRef}
      aria-label={`${item.label} section`}
      className="fixed bottom-4 left-4 right-4 z-20 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:w-[380px] md:-translate-y-1/2 lg:right-8 lg:w-[420px]"
    >
      <div className="wood-walnut wood-panel-shadow relative overflow-hidden rounded-2xl border-[3px] border-[#b47c3c] p-5 sm:p-6">
        {/* Inner warm highlight border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[5px] rounded-xl border border-[#ffd78c]/20"
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-3 border-b border-[#8e5d29]/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#ffd27d]/80 bg-gradient-to-b from-[#eda136] to-[#b56310] text-[#fff8e8] shadow-md">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-[#e8b468] uppercase">
                Section 0{item.order}
              </p>
              <h2 className="font-display wood-text-shadow text-2xl font-bold text-[#fff5df]">
                {item.label}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close section panel"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#a9763c] bg-[#2a170c] text-[#f7ebd2] transition hover:border-[#ffd27d] hover:text-[#ffd27d]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Minimal Phase 1 body */}
        <div className="relative mt-4 space-y-4">
          <p className="text-sm font-semibold text-[#ffd999]">{item.subtitle}</p>

          <div className="rounded-xl border border-[#8e5d29]/60 bg-[#22120a]/80 p-4 text-sm leading-relaxed text-[#eedcc0]">
            {item.milestoneNote}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-[#cbb18b]">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#f0ad42]" />
              Interactive 3D workshop link: next phase
            </span>
            <span className="rounded border border-[#7d5224] bg-[#29160c] px-2 py-0.5 font-mono text-[11px] text-[#e7c796]">
              ESC
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
