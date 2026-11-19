import { Gamepad2, Mail, Sword, Trophy } from 'lucide-react';
import { TROPHY_ACHIEVEMENTS, type TrophyId } from '../../data/achievements';
import { NAVIGATION_ITEMS, type SectionId } from '../../data/navigation';
import { PROJECTS, type ProjectId } from '../../data/projects';
import { SKILL_CATEGORIES, type SkillCategoryId } from '../../data/skills';
import type { ContactLetterStage } from '../../hooks/useWorkshopNavigation';
import { AboutMePaperNote } from '../Scene/AboutMeCard';

interface MobileSectionControlsProps {
  activeSection: SectionId | null;
  arrivedSection: SectionId | null;
  isWebGLFallback: boolean;
  selectedTrophyId: TrophyId | null;
  selectedProjectId: ProjectId | null;
  selectedSkillCategoryId: SkillCategoryId | null;
  contactLetterStage: ContactLetterStage;
  onSelectSection: (id: SectionId) => void;
  onSelectTrophy: (id: TrophyId) => void;
  onSelectProject: (id: ProjectId) => void;
  onSelectSkillCategory: (id: SkillCategoryId) => void;
  onOpenContactMailbox: () => void;
}

/**
 * Mobile-only (< 768px) HUD layer for the 3D workshop so every project,
 * trophy, skill branch, About note, and Contact letter stays 1-tap reachable
 * and fully readable on small portrait phones.
 */
export function MobileSectionControls({
  activeSection,
  arrivedSection,
  isWebGLFallback,
  selectedTrophyId,
  selectedProjectId,
  selectedSkillCategoryId,
  contactLetterStage,
  onSelectSection,
  onSelectTrophy,
  onSelectProject,
  onSelectSkillCategory,
  onOpenContactMailbox,
}: MobileSectionControlsProps) {
  if (isWebGLFallback) return null;

  const isAboutArrived = activeSection === 'about' && arrivedSection === 'about';
  const isExperienceArrived =
    activeSection === 'experience' && arrivedSection === 'experience';
  const isProjectsArrived =
    activeSection === 'projects' && arrivedSection === 'projects';
  const isSkillsArrived = activeSection === 'skills' && arrivedSection === 'skills';
  const isContactArrived =
    activeSection === 'contact' && arrivedSection === 'contact';

  const hasOpenModal =
    selectedTrophyId !== null ||
    selectedProjectId !== null ||
    selectedSkillCategoryId !== null ||
    contactLetterStage !== 'closed';

  return (
    <div className="md:hidden">
      {/* Readable floating paper note over the zoomed corkboard camera */}
      {isAboutArrived && (
        <div className="fixed inset-x-3 bottom-4 top-16 z-20 flex items-center justify-center overflow-y-auto py-2">
          <AboutMePaperNote
            visible={isAboutArrived}
            rotation={0.9}
            className="w-full max-w-[420px]"
          />
        </div>
      )}

      {/* Overview 1-tap quick navigation bar */}
      {activeSection === null && (
        <nav
          aria-label="Quick section navigation"
          className="fixed inset-x-3 bottom-3 z-20"
        >
          <div className="wood-walnut wood-panel-shadow rounded-xl border-2 border-[#b47c3c] p-2">
            <div className="grid grid-cols-5 gap-1.5">
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className="wood-plank-idle flex cursor-pointer items-center justify-center rounded-lg border border-[#c8934b]/90 px-1 py-2 text-[11px] font-bold leading-tight text-[#ffefc6] transition active:translate-y-px"
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Quick item pickers inside interactive 3D sections */}
      {!hasOpenModal && isExperienceArrived && (
        <div className="fixed inset-x-3 bottom-3 z-20">
          <div className="wood-walnut wood-panel-shadow rounded-xl border-2 border-[#b47c3c] p-2.5">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-[#f3be66]">
              <Trophy className="h-3.5 w-3.5 shrink-0" />
              <span>Tap a trophy or select below to inspect</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TROPHY_ACHIEVEMENTS.map((trophy) => (
                <button
                  key={trophy.id}
                  type="button"
                  onClick={() => onSelectTrophy(trophy.id)}
                  className="wood-plank-idle cursor-pointer rounded-lg border border-[#c8934b] px-2.5 py-1.5 text-xs font-bold text-[#ffefc6] transition active:translate-y-px"
                >
                  {trophy.id === 'unity-cert'
                    ? 'Unity Cert'
                    : trophy.id === 'publication'
                      ? 'Publication'
                      : trophy.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!hasOpenModal && isProjectsArrived && (
        <div className="fixed inset-x-3 bottom-3 z-20">
          <div className="wood-walnut wood-panel-shadow rounded-xl border-2 border-[#b47c3c] p-2.5">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-[#f3be66]">
              <Gamepad2 className="h-3.5 w-3.5 shrink-0" />
              <span>Tap a collectible or choose a project</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  className="wood-plank-idle cursor-pointer rounded-lg border border-[#c8934b] px-2.5 py-1.5 text-xs font-bold text-[#ffefc6] transition active:translate-y-px"
                >
                  {project.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!hasOpenModal && isSkillsArrived && (
        <div className="fixed inset-x-3 bottom-3 z-20">
          <div className="wood-walnut wood-panel-shadow rounded-xl border-2 border-[#b47c3c] p-2.5">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-[#f3be66]">
              <Sword className="h-3.5 w-3.5 shrink-0" />
              <span>Tap a skill branch on the board or select</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectSkillCategory(category.id)}
                  className="wood-plank-idle cursor-pointer rounded-lg border border-[#c8934b] px-2.5 py-1.5 text-xs font-bold text-[#ffefc6] transition active:translate-y-px"
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!hasOpenModal && isContactArrived && (
        <div className="fixed inset-x-3 bottom-3 z-20 flex justify-center">
          <button
            type="button"
            onClick={onOpenContactMailbox}
            className="wood-plank-active wood-panel-shadow inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#ffe08a] px-4 py-2.5 text-xs font-bold text-[#fff8e8] transition active:translate-y-px"
          >
            <Mail className="h-4 w-4 text-[#fff3cf]" />
            <span>Open Mailbox &amp; Contact Letter</span>
          </button>
        </div>
      )}
    </div>
  );
}
