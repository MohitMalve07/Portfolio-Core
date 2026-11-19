import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Award, BookOpen, Briefcase, Trophy, X } from 'lucide-react';
import {
  TROPHY_ACHIEVEMENTS,
  type TrophyAchievement,
  type TrophyId,
} from '../../data/achievements';
import { MobileItemTabs } from './MobileItemTabs';

const TROPHY_TABS: readonly { id: TrophyId; label: string }[] =
  TROPHY_ACHIEVEMENTS.map((t) => ({
    id: t.id,
    label:
      t.id === 'unity-cert'
        ? 'Unity Cert'
        : t.id === 'publication'
          ? 'Publication'
          : t.title,
  }));

interface AchievementCardProps {
  achievement: TrophyAchievement | null;
  onSelectTrophy?: (id: TrophyId) => void;
  onClose: () => void;
}

const CATEGORY_ICON = {
  Experience: Briefcase,
  Certification: Award,
  Publication: BookOpen,
} as const;

/**
 * Compact dark-walnut & golden-beveled achievement card displayed when
 * inspecting an individual trophy on the shelf.
 */
export function AchievementCard({
  achievement,
  onSelectTrophy,
  onClose,
}: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!achievement || !cardRef.current) return;

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
  }, [achievement?.id]);

  if (!achievement) return null;

  const CategoryIcon = CATEGORY_ICON[achievement.category] ?? Trophy;

  return (
    <aside
      ref={cardRef}
      role="dialog"
      aria-label={achievement.trophyLabel}
      className="fixed bottom-3 right-3 left-3 z-30 md:left-auto md:bottom-5 md:right-5 md:w-[410px]"
    >
      {/* Carved wood outer rim with warm gold highlight */}
      <div className="wood-panel-shadow relative rounded-xl border-[3px] border-[#211007] bg-gradient-to-b from-[#9c693a] via-[#6e4522] to-[#432612] p-[5px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[2px] rounded-[9px] border border-[#f0c783]/45"
        />

        {/* Recessed dark walnut interior */}
        <div className="wood-walnut relative max-h-[70dvh] overflow-y-auto rounded-lg border-2 border-[#231107] p-4 shadow-[inset_0_6px_16px_rgba(8,3,1,0.75)] sm:p-4.5 md:max-h-none md:overflow-visible">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[5px] rounded-md border border-[#d6a259]/25"
          />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-3 border-b border-[#8e5d29]/55 pb-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#ffd47a]/80 bg-gradient-to-b from-[#eda136] to-[#b05d0d] text-[#fff8e6] shadow-md">
                <Trophy className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#f3be66] uppercase md:text-[11px]">
                  <CategoryIcon className="h-3.5 w-3.5 text-[#f5b449]" />
                  <span>{achievement.category}</span>
                </div>
                <h2 className="font-display game-label-shadow mt-0.5 text-xl font-bold leading-snug text-[#fff4d4] md:text-lg">
                  {achievement.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close trophy details"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[#a87338] bg-[#2b170b] text-[#ffefc6] transition hover:border-[#ffd785] hover:text-[#ffd785] active:translate-y-px"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {onSelectTrophy && (
            <MobileItemTabs
              options={TROPHY_TABS}
              activeId={achievement.id}
              onSelect={onSelectTrophy}
            />
          )}

          {/* Role / Organization / Date & Details */}
          <div className="relative mt-3 space-y-2.5 text-sm text-[#f3e4c8]">
            {achievement.subtitle && (
              <p className="text-[15px] font-bold text-[#ffd88f] md:text-[13.5px]">
                {achievement.subtitle}
              </p>
            )}

            <p className="inline-block rounded-md border border-[#8e5d29]/65 bg-[#241309]/85 px-2.5 py-1 text-[13px] font-semibold text-[#e9cb99] md:py-0.5 md:text-xs">
              {achievement.periodLabel}
            </p>

            {achievement.details.length > 0 && (
              <ul className="space-y-2 rounded-lg border border-[#8e5d29]/55 bg-[#221209]/75 p-3.5 text-[15px] leading-relaxed text-[#efe0c4] md:space-y-1.5 md:p-3 md:text-[13px]">
                {achievement.details.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f0ad42] md:mt-1.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
