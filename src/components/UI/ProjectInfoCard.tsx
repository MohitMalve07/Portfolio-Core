import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ExternalLink, Gamepad2, Lock, X } from 'lucide-react';
import type { ProjectInfo } from '../../data/projects';

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface ProjectInfoCardProps {
  project: ProjectInfo | null;
  onClose: () => void;
}

/**
 * Compact dark walnut & golden-beveled card showing details and external
 * Play Demo / GitHub actions for the selected collectible project model.
 */
export function ProjectInfoCard({ project, onClose }: ProjectInfoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project || !cardRef.current) return;

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
  }, [project?.id]);

  if (!project) return null;

  return (
    <aside
      ref={cardRef}
      role="dialog"
      aria-label={`${project.title} details`}
      className="fixed bottom-4 left-4 right-4 z-30 md:left-auto md:bottom-5 md:right-5 md:w-[420px]"
    >
      <div className="wood-panel-shadow relative rounded-xl border-[3px] border-[#211007] bg-gradient-to-b from-[#9c693a] via-[#6e4522] to-[#432612] p-[5px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[2px] rounded-[9px] border border-[#f0c783]/45"
        />

        <div className="wood-walnut relative rounded-lg border-2 border-[#231107] p-4 shadow-[inset_0_6px_16px_rgba(8,3,1,0.75)] sm:p-4.5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[5px] rounded-md border border-[#d6a259]/25"
          />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-3 border-b border-[#8e5d29]/55 pb-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#ffd47a]/80 bg-gradient-to-b from-[#eda136] to-[#b05d0d] text-[#fff8e6] shadow-md">
                <Gamepad2 className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-wider text-[#f3be66] uppercase">
                  Project Collectible · {project.objectLabel}
                </p>
                <h2 className="font-display game-label-shadow mt-0.5 text-lg font-bold leading-snug text-[#fff4d4]">
                  {project.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[#a87338] bg-[#2b170b] text-[#ffefc6] transition hover:border-[#ffd785] hover:text-[#ffd785] active:translate-y-px"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <div className="relative mt-3 space-y-3.5 text-sm text-[#f3e4c8]">
            <p className="rounded-lg border border-[#8e5d29]/55 bg-[#221209]/75 p-3 text-[13px] leading-relaxed text-[#efe0c4]">
              {project.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={project.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wood-plank-active inline-flex items-center gap-1.5 rounded-lg border-2 border-[#ffe08a] px-3.5 py-1.5 text-xs font-bold text-[#fff9e6] shadow-md transition hover:brightness-110 active:translate-y-px"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="font-display tracking-wide">Play Demo</span>
              </a>

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wood-plank-idle inline-flex items-center gap-1.5 rounded-lg border-2 border-[#c8934b] px-3.5 py-1.5 text-xs font-bold text-[#ffefc6] shadow-md transition hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px"
                >
                  <GitHubMark className="h-3.5 w-3.5 text-[#f5b951]" />
                  <span className="font-display tracking-wide">GitHub</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Repository is private until demo release"
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border-2 border-[#6e4b26] bg-[#25140b]/85 px-3.5 py-1.5 text-xs font-bold text-[#bda27c] opacity-85"
                >
                  <Lock className="h-3.5 w-3.5 text-[#c79857]" />
                  <span className="font-display tracking-wide">
                    GitHub · {project.githubStatusLabel ?? 'Coming Soon'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
