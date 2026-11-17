import { useCallback, useState } from 'react';
import { ArrowLeft, Gamepad2, Mail, Sword, Trophy } from 'lucide-react';
import { WorkshopScene } from './components/Scene/WorkshopScene';
import { AchievementCard } from './components/UI/AchievementCard';
import { ContactLetter } from './components/UI/ContactLetter';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { MainMenu } from './components/UI/MainMenu';
import { ProjectInfoCard } from './components/UI/ProjectInfoCard';
import { SkillInfoCard } from './components/UI/SkillInfoCard';
import { getTrophyById } from './data/achievements';
import { getProjectById } from './data/projects';
import { getSkillCategoryById } from './data/skills';
import { useWorkshopNavigation } from './hooks/useWorkshopNavigation';

export function App() {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const {
    activeSection,
    arrivedSection,
    selectedTrophyId,
    selectedProjectId,
    selectedSkillCategoryId,
    contactLetterStage,
    selectSection,
    closeSection,
    selectTrophy,
    clearTrophy,
    selectProject,
    clearProject,
    selectSkillCategory,
    clearSkillCategory,
    openContactMailbox,
    completeContactReveal,
    closeContactLetter,
    handleTransitionStart,
    handleTransitionComplete,
  } = useWorkshopNavigation(null);

  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  const handleSceneError = useCallback((error: Error) => {
    setLoadError(error);
  }, []);

  const isAboutArrived =
    activeSection === 'about' && arrivedSection === 'about';
  const isExperienceArrived =
    activeSection === 'experience' && arrivedSection === 'experience';
  const isProjectsArrived =
    activeSection === 'projects' && arrivedSection === 'projects';
  const isSkillsArrived =
    activeSection === 'skills' && arrivedSection === 'skills';
  const isContactArrived =
    activeSection === 'contact' && arrivedSection === 'contact';

  const selectedTrophy = isExperienceArrived
    ? getTrophyById(selectedTrophyId)
    : null;
  const selectedProject = isProjectsArrived
    ? getProjectById(selectedProjectId)
    : null;
  const selectedSkillCategory = isSkillsArrived
    ? getSkillCategoryById(selectedSkillCategoryId)
    : null;
  const showContactLetter = isContactArrived && contactLetterStage === 'open';

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#120b07]">
      <WorkshopScene
        activeSection={activeSection}
        arrivedSection={arrivedSection}
        selectedTrophyId={selectedTrophyId}
        selectedProjectId={selectedProjectId}
        selectedSkillCategoryId={selectedSkillCategoryId}
        contactLetterStage={contactLetterStage}
        onSceneReady={handleSceneReady}
        onSceneError={handleSceneError}
        onCameraTransitionStart={handleTransitionStart}
        onCameraTransitionComplete={handleTransitionComplete}
        onCloseSection={closeSection}
        onSelectTrophy={selectTrophy}
        onSelectProject={selectProject}
        onSelectSkillCategory={selectSkillCategory}
        onOpenContactMailbox={openContactMailbox}
        onCompleteContactReveal={completeContactReveal}
      />

      {/* Game-style left navigation menu */}
      <MainMenu
        activeSection={activeSection}
        onSelectSection={selectSection}
      />

      {/* Compact HUD close/back control outside the 3D focal items */}
      {(isAboutArrived ||
        isExperienceArrived ||
        isProjectsArrived ||
        isSkillsArrived ||
        isContactArrived) && (
        <div
          className={[
            'fixed right-5 z-30',
            isExperienceArrived ||
            isProjectsArrived ||
            isSkillsArrived ||
            isContactArrived
              ? 'top-5'
              : 'bottom-5',
          ].join(' ')}
        >
          <button
            type="button"
            onClick={closeSection}
            aria-label="Back to Workshop"
            className="wood-walnut wood-panel-shadow inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#c8934b] px-4 py-2 text-sm font-bold text-[#ffefc6] transition hover:scale-[1.03] hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px"
          >
            <ArrowLeft className="h-4 w-4 text-[#f5b951]" />
            <span className="font-display game-label-shadow tracking-wide">
              Back to Workshop
            </span>
            <span className="ml-1 rounded border border-[#7d5224] bg-[#241309] px-1.5 py-0.5 font-mono text-[10px] text-[#e7c796]">
              ESC
            </span>
          </button>
        </div>
      )}

      {/* Subtle prompts when arriving at interactive sections */}
      {isExperienceArrived && !selectedTrophy && (
        <div className="fixed bottom-5 right-5 z-20 hidden sm:block">
          <div className="wood-walnut wood-panel-shadow inline-flex items-center gap-2 rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-xs font-semibold text-[#f3dfb8]">
            <Trophy className="h-4 w-4 text-[#f5b449]" />
            <span>Click any of the four trophies on the top shelf to inspect</span>
          </div>
        </div>
      )}

      {isProjectsArrived && !selectedProject && (
        <div className="fixed bottom-5 right-5 z-20 hidden sm:block">
          <div className="wood-walnut wood-panel-shadow inline-flex items-center gap-2 rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-xs font-semibold text-[#f3dfb8]">
            <Gamepad2 className="h-4 w-4 text-[#f5b449]" />
            <span>Click any collectible on the desk shelf to inspect</span>
          </div>
        </div>
      )}

      {isSkillsArrived && !selectedSkillCategory && (
        <div className="fixed bottom-5 right-5 z-20 hidden sm:block">
          <div className="wood-walnut wood-panel-shadow inline-flex items-center gap-2 rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-xs font-semibold text-[#f3dfb8]">
            <Sword className="h-4 w-4 text-[#f5b449]" />
            <span>Click any of the four skill branches on the board to inspect</span>
          </div>
        </div>
      )}

      {isContactArrived && contactLetterStage === 'closed' && (
        <div className="fixed bottom-5 right-5 z-20 hidden sm:block">
          <div className="wood-walnut wood-panel-shadow inline-flex items-center gap-2 rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-xs font-semibold text-[#f3dfb8]">
            <Mail className="h-4 w-4 text-[#f5b449]" />
            <span>Click the mailbox to open your letter</span>
          </div>
        </div>
      )}

      {/* Interactive detail cards */}
      <AchievementCard achievement={selectedTrophy} onClose={clearTrophy} />
      <ProjectInfoCard project={selectedProject} onClose={clearProject} />
      <SkillInfoCard
        category={selectedSkillCategory}
        onClose={clearSkillCategory}
      />
      <ContactLetter visible={showContactLetter} onClose={closeContactLetter} />

      {/* Fullscreen loading overlay while GLB downloads & initializes */}
      <LoadingScreen isSceneReady={isSceneReady} loadError={loadError} />
    </main>
  );
}

export default App;
