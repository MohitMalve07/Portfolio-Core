import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Code2, Cpu, Globe, Layers, X } from 'lucide-react';
import type { SkillCategory } from '../../data/skills';

interface SkillInfoCardProps {
  category: SkillCategory | null;
  onClose: () => void;
}

const CATEGORY_ICON = {
  programming: Code2,
  gamedev: Cpu,
  multiplayer: Globe,
  'arvr-tools': Layers,
} as const;

/**
 * Compact dark walnut & golden-beveled card showing skills, description,
 * and related projects for the selected Skill Tree branch.
 */
export function SkillInfoCard({ category, onClose }: SkillInfoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!category || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.94, y: 12 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.32,
          ease: 'power3.out',
        },
      );
    }, cardRef);

    return () => ctx.revert();
  }, [category?.id]);

  if (!category) return null;

  const Icon = CATEGORY_ICON[category.id];

  return (
    <aside
      ref={cardRef}
      role="dialog"
      aria-label={`${category.title} skills`}
      className="fixed bottom-3 left-3 right-3 z-30 md:left-auto md:bottom-5 md:right-5 md:w-[420px]"
    >
      <div className="wood-panel-shadow relative rounded-xl border-[3px] border-[#211007] bg-gradient-to-b from-[#9c693a] via-[#6e4522] to-[#432612] p-[5px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[2px] rounded-[9px] border border-[#f0c783]/45"
        />

        <div className="wood-walnut relative max-h-[70dvh] overflow-y-auto rounded-lg border-2 border-[#231107] p-4 shadow-[inset_0_6px_16px_rgba(8,3,1,0.75)] sm:p-4.5 md:max-h-none md:overflow-visible">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[5px] rounded-md border border-[#d6a259]/25"
          />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-3 border-b border-[#8e5d29]/55 pb-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#ffd47a]/80 bg-gradient-to-b from-[#eda136] to-[#b05d0d] text-[#fff8e6] shadow-md">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-wider text-[#f3be66] uppercase">
                  Skill Branch
                </p>
                <h2 className="font-display game-label-shadow mt-0.5 text-lg font-bold leading-snug text-[#fff4d4]">
                  {category.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close skill details"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[#a87338] bg-[#2b170b] text-[#ffefc6] transition hover:border-[#ffd785] hover:text-[#ffd785] active:translate-y-px"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Summary, Skill Badges & Related Projects */}
          <div className="relative mt-3 space-y-3 text-sm text-[#f3e4c8]">
            <p className="text-[13px] leading-relaxed text-[#efe0c4]">
              {category.summary}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-[#b47c3c]/80 bg-[#251309]/90 px-2.5 py-1 text-xs font-bold text-[#ffe29e]"
                >
                  {skill}
                </span>
              ))}
            </div>

            {category.relatedProjects.length > 0 && (
              <div className="rounded-lg border border-[#8e5d29]/55 bg-[#221209]/75 px-3 py-2 text-xs text-[#dfcca9]">
                <span className="font-bold text-[#f3be66]">Applied in: </span>
                <span>{category.relatedProjects.join(' · ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
