import { ExternalLink, Flame, Gamepad2, Layers, Mail, RefreshCw, Sparkles, Trophy } from 'lucide-react';
import { TROPHY_ACHIEVEMENTS } from '../../data/achievements';
import { NAVIGATION_ITEMS, type SectionId } from '../../data/navigation';
import { PROJECTS } from '../../data/projects';
import { SKILL_CATEGORIES } from '../../data/skills';

interface Workshop2DFallbackProps {
  activeSection: SectionId | null;
  onSelectSection: (id: SectionId) => void;
  onOpenContactLetter: () => void;
  onRetry3D: () => void;
}

/**
 * Interactive 2D fallback shown automatically when WebGL context creation
 * fails or is blocked by the visitor's browser, keeping every portfolio
 * section, live itch.io demo, and contact workflow accessible.
 */
export function Workshop2DFallback({
  activeSection,
  onSelectSection,
  onOpenContactLetter,
  onRetry3D,
}: Workshop2DFallbackProps) {
  return (
    <div className="relative flex h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_24%_22%,rgba(235,134,42,0.22),transparent_48%),radial-gradient(circle_at_78%_76%,rgba(244,174,78,0.12),transparent_52%),linear-gradient(155deg,#1d1009_0%,#140b06_55%,#0e0704_100%)] px-4 pb-20 pt-16 md:pl-[330px] md:pr-8 md:pt-8 xl:pl-[376px]">
      {/* Subtle 2D notice + Retry 3D action when overview is active (clear of Back to Workshop) */}
      {activeSection === null && (
        <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
          <div className="wood-walnut wood-panel-shadow hidden items-center gap-2 rounded-xl border border-[#b47c3c]/80 px-3 py-1.5 text-xs font-semibold text-[#e9d3ad] sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-[#f5b951]" />
            <span>2D Mode (WebGL unavailable on this browser)</span>
          </div>
          <button
            type="button"
            onClick={onRetry3D}
            className="wood-walnut wood-panel-shadow inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-[#c8934b] px-3.5 py-1.5 text-xs font-bold text-[#ffefc6] transition hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#f5b951]" />
            <span>Retry 3D</span>
          </button>
        </div>
      )}

      <div className="mx-auto my-auto w-full max-w-4xl py-4">
        {activeSection === null && (
          <section className="wood-walnut wood-panel-shadow rounded-2xl border-[3px] border-[#b47c3c] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#8e5d29]/55 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#ffd47a]/80 bg-gradient-to-b from-[#eda136] to-[#b05d0d] text-[#fff8e6] shadow-md">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-display wood-text-shadow text-2xl font-bold text-[#fff4d4] sm:text-3xl">
                    Mohit Malve — Adventure Workshop
                  </h1>
                  <p className="mt-0.5 text-sm font-semibold text-[#f3be66]">
                    Unity Gameplay Programmer · C#, Online Multiplayer · Android, WebGL &amp; Windows
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRetry3D}
                className="wood-plank-idle inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#c8934b] px-4 py-2 text-xs font-bold text-[#ffefc6] transition hover:border-[#ffe08a] hover:brightness-110 sm:hidden"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#f5b951]" />
                <span>Retry 3D Scene</span>
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#efe0c4]">
              WebGL 3D rendering is blocked or unavailable in this browser session, so you&apos;re viewing the interactive 2D workshop view. Explore every section using the wooden menu or cards below:
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className="wood-plank-idle flex cursor-pointer flex-col items-start gap-1 rounded-xl border-2 border-[#b47c3c]/85 p-4 text-left transition hover:scale-[1.01] hover:border-[#ffd27d] hover:brightness-110"
                >
                  <span className="font-display text-sm font-bold text-[#ffe3a3]">
                    {item.order}. {item.label}
                  </span>
                  <span className="text-xs leading-snug text-[#dfc9a2]">
                    {item.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section
            aria-label="About Mohit Malve"
            className="paper-note-surface font-handwritten mx-auto max-w-xl p-6 text-[#2b1a0e] shadow-2xl sm:p-8"
          >
            <h2 className="text-3xl font-bold leading-none text-[#231207]">
              Mohit Malve
            </h2>
            <p className="mt-1 text-lg font-semibold text-[#462a16]">
              Gameplay Programmer | Unity, C#, Online Multiplayer
            </p>
            <p className="mt-4 text-lg leading-snug text-[#2e1c0f]">
              Gameplay programmer focused on online co-op and vehicle gameplay in Unity.
              Built, tested and shipped a cross-play web and Windows co-op driving game
              to external playtesters.
            </p>
            <ul className="mt-4 space-y-1 text-base text-[#2b1a0e]">
              <li>- Location: Pune, India</li>
              <li>- Education: B.Tech in Computer Engineering</li>
              <li>- University: Vishwakarma Institute of Information Technology, Pune</li>
              <li>- CGPA: 8.51</li>
              <li>- Certification: Unity Certified Associate: Programmer (2026)</li>
            </ul>
          </section>
        )}

        {activeSection === 'experience' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-[#f5b951]" />
              <h2 className="font-display wood-text-shadow text-xl font-bold text-[#fff4d4]">
                Experience, Certification &amp; Publication
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {TROPHY_ACHIEVEMENTS.map((item) => (
                <article
                  key={item.id}
                  className="wood-walnut wood-panel-shadow rounded-xl border-2 border-[#b47c3c] p-4"
                >
                  <p className="text-[11px] font-bold tracking-wider text-[#f3be66] uppercase">
                    {item.category} · {item.periodLabel}
                  </p>
                  <h3 className="font-display mt-1 text-lg font-bold text-[#fff4d4]">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs font-semibold text-[#e6cca0]">
                      {item.subtitle}
                    </p>
                  )}
                  {item.details.length > 0 && (
                    <ul className="mt-2.5 space-y-1.5 border-t border-[#8e5d29]/45 pt-2.5 text-xs leading-relaxed text-[#efe0c4]">
                      {item.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5b449]" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'projects' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="h-5 w-5 text-[#f5b951]" />
              <h2 className="font-display wood-text-shadow text-xl font-bold text-[#fff4d4]">
                Featured Unity Projects
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {PROJECTS.map((project) => (
                <article
                  key={project.id}
                  className="wood-walnut wood-panel-shadow flex flex-col justify-between rounded-xl border-2 border-[#b47c3c] p-4"
                >
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-[#f3be66] uppercase">
                      {project.objectLabel}
                    </p>
                    <h3 className="font-display mt-1 text-lg font-bold text-[#fff4d4]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#efe0c4]">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[#8e5d29]/45 pt-3">
                    <a
                      href={project.playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wood-plank-active inline-flex items-center gap-1.5 rounded-lg border border-[#ffd47a] px-3 py-1.5 text-xs font-bold text-[#fff8e8] transition hover:brightness-110"
                    >
                      <span>Play Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wood-plank-idle inline-flex items-center gap-1.5 rounded-lg border border-[#b47c3c] px-3 py-1.5 text-xs font-bold text-[#ffefc6] transition hover:border-[#ffe08a]"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-lg border border-[#7b4f21]/70 bg-[#231309]/80 px-2.5 py-1.5 text-[11px] font-semibold text-[#c5ab82]">
                        {project.githubStatusLabel ?? 'Coming Soon'}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'skills' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-[#f5b951]" />
              <h2 className="font-display wood-text-shadow text-xl font-bold text-[#fff4d4]">
                Core Skills
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {SKILL_CATEGORIES.map((category) => (
                <article
                  key={category.id}
                  className="wood-walnut wood-panel-shadow rounded-xl border-2 border-[#b47c3c] p-4"
                >
                  <h3 className="font-display text-lg font-bold text-[#fff4d4]">
                    {category.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#efe0c4]">
                    {category.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-[#b47c3c]/80 bg-[#251309]/90 px-2.5 py-1 text-xs font-bold text-[#ffe29e]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="wood-walnut wood-panel-shadow mx-auto max-w-lg rounded-2xl border-2 border-[#b47c3c] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#ffd47a]/80 bg-gradient-to-b from-[#eda136] to-[#b05d0d] text-[#fff8e6]">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="font-display mt-3 text-xl font-bold text-[#fff4d4]">
              Let&apos;s Connect
            </h2>
            <p className="mt-1.5 text-sm text-[#e6cca0]">
              Open the contact letter to send a quick note or copy direct links.
            </p>
            <button
              type="button"
              onClick={onOpenContactLetter}
              className="wood-plank-active mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#ffd47a] px-5 py-2.5 text-sm font-bold text-[#fff8e8] transition hover:brightness-110"
            >
              <Mail className="h-4 w-4" />
              <span>Open Contact Letter</span>
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
