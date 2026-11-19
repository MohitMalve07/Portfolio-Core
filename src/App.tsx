import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Gamepad2, LayoutGrid, Mail, Sword, Trophy } from 'lucide-react';
import { WorkshopScene } from './components/Scene/WorkshopScene';
import { AchievementCard } from './components/UI/AchievementCard';
import { AudioToggle } from './components/UI/AudioToggle';
import { ContactLetter } from './components/UI/ContactLetter';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { MainMenu } from './components/UI/MainMenu';
import { MobileSectionControls } from './components/UI/MobileSectionControls';
import { ProjectInfoCard } from './components/UI/ProjectInfoCard';
import { SkillInfoCard } from './components/UI/SkillInfoCard';
import { Workshop2DFallback } from './components/UI/Workshop2DFallback';
import { getTrophyById } from './data/achievements';
import { getProjectById } from './data/projects';
import { getSkillCategoryById } from './data/skills';
import { useWorkshopNavigation } from './hooks/useWorkshopNavigation';
import { workshopAudio } from './utils/workshopAudio';

export function App() {
  const wants2D =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('view') === '2d';
  const [isSceneReady, setIsSceneReady] = useState(wants2D);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [isWebGLFallback, setIsWebGLFallback] = useState(wants2D);
  const [sceneRetryKey, setSceneRetryKey] = useState(0);
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
    if (/webgl|context/i.test(error.message)) {
      setIsWebGLFallback(true);
      setIsSceneReady(true);
      setLoadError(null);
      return;
    }
    setLoadError(error);
  }, []);

  const handleEnterFallback = useCallback(() => {
    setIsWebGLFallback(true);
    setIsSceneReady(true);
    setLoadError(null);
  }, []);

  const handleRetry3D = useCallback(() => {
    setIsWebGLFallback(false);
    setIsSceneReady(false);
    setLoadError(null);
    setSceneRetryKey((k) => k + 1);
  }, []);

  const handleOpenContact2D = useCallback(() => {
    openContactMailbox();
    completeContactReveal();
  }, [openContactMailbox, completeContactReveal]);

  useEffect(() => {
    const handleUnlockGesture = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-audio-toggle]')) return;
      workshopAudio.unlockFromGesture();
    };

    const handleInteractiveClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-audio-toggle]')) return;
      if (target.closest('button, a, [role="button"], input[type="submit"]')) {
        workshopAudio.playClickSound();
      }
    };

    const handleVisibility = () => {
      workshopAudio.handleVisibilityChange();
    };

    window.addEventListener('pointerdown', handleUnlockGesture, { capture: true });
    window.addEventListener('keydown', handleUnlockGesture, { capture: true });
    document.addEventListener('click', handleInteractiveClick, { capture: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pointerdown', handleUnlockGesture, { capture: true });
      window.removeEventListener('keydown', handleUnlockGesture, { capture: true });
      document.removeEventListener('click', handleInteractiveClick, { capture: true });
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    workshopAudio.setSectionFocus(activeSection);
  }, [activeSection]);

  const effectiveArrived = isWebGLFallback ? activeSection : arrivedSection;
  const isAboutArrived =
    activeSection === 'about' && effectiveArrived === 'about';
  const isExperienceArrived =
    activeSection === 'experience' && effectiveArrived === 'experience';
  const isProjectsArrived =
    activeSection === 'projects' && effectiveArrived === 'projects';
  const isSkillsArrived =
    activeSection === 'skills' && effectiveArrived === 'skills';
  const isContactArrived =
    activeSection === 'contact' && effectiveArrived === 'contact';

  const selectedTrophy =
    !isWebGLFallback && isExperienceArrived
      ? getTrophyById(selectedTrophyId)
      : null;
  const selectedProject =
    !isWebGLFallback && isProjectsArrived
      ? getProjectById(selectedProjectId)
      : null;
  const selectedSkillCategory =
    !isWebGLFallback && isSkillsArrived
      ? getSkillCategoryById(selectedSkillCategoryId)
      : null;
  const showContactLetter = isContactArrived && contactLetterStage === 'open';

  const hasArrivedSection =
    isAboutArrived ||
    isExperienceArrived ||
    isProjectsArrived ||
    isSkillsArrived ||
    isContactArrived;

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#120b07]">
      {isWebGLFallback ? (
        <Workshop2DFallback
          activeSection={activeSection}
          onSelectSection={selectSection}
          onOpenContactLetter={handleOpenContact2D}
          onRetry3D={handleRetry3D}
        />
      ) : (
        <WorkshopScene
          key={sceneRetryKey}
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
      )}

      {/* Game-style left navigation menu */}
      <MainMenu
        activeSection={activeSection}
        onSelectSection={selectSection}
      />

      {/* Mobile top-right HUD (kept clear of bottom quick-pickers and detail cards) */}
      <div className="fixed right-3 top-3 z-30 flex items-center gap-1.5 md:hidden">
        {activeSection !== null ? (
          <button
            type="button"
            onClick={closeSection}
            aria-label="Back to Workshop"
            className="wood-walnut wood-panel-shadow inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-xl border-2 border-[#c8934b] px-3 text-xs font-bold text-[#ffefc6] transition hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#f5b951]" />
            <span className="font-display game-label-shadow tracking-wide">
              Back
            </span>
          </button>
        ) : (
          !isWebGLFallback && (
            <button
              type="button"
              onClick={handleEnterFallback}
              title="Switch to Fast 2D Portfolio View"
              className="wood-walnut wood-panel-shadow inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-xl border-2 border-[#b47c3c] px-2.5 text-xs font-bold text-[#ffefc6] transition hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-[#f5b951]" />
              <span>2D View</span>
            </button>
          )
        )}
        {isSceneReady && <AudioToggle compact />}
      </div>

      {/* Desktop 2D View quick toggle on overview */}
      {activeSection === null && !isWebGLFallback && isSceneReady && (
        <div className="fixed right-5 top-5 z-30 hidden md:block">
          <button
            type="button"
            onClick={handleEnterFallback}
            title="Switch to Fast 2D Portfolio View"
            className="wood-walnut wood-panel-shadow inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-[#b47c3c] px-3 py-1.5 text-xs font-bold text-[#ffefc6] transition hover:scale-[1.03] hover:border-[#ffe08a] hover:brightness-110 active:translate-y-px"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-[#f5b951]" />
            <span>2D View</span>
          </button>
        </div>
      )}

      {/* Desktop HUD close/back control outside the 3D focal items */}
      {hasArrivedSection && (
        <div
          className={[
            'fixed right-5 z-30 hidden md:block',
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

      {/* Mobile 1-tap quick navigation, readable About overlay & item pickers */}
      <MobileSectionControls
        activeSection={activeSection}
        arrivedSection={arrivedSection}
        isWebGLFallback={isWebGLFallback}
        selectedTrophyId={selectedTrophyId}
        selectedProjectId={selectedProjectId}
        selectedSkillCategoryId={selectedSkillCategoryId}
        contactLetterStage={contactLetterStage}
        onSelectSection={selectSection}
        onSelectTrophy={selectTrophy}
        onSelectProject={selectProject}
        onSelectSkillCategory={selectSkillCategory}
        onOpenContactMailbox={openContactMailbox}
      />

      {/* Subtle desktop prompts when arriving at interactive 3D sections */}
      {!isWebGLFallback && isExperienceArrived && !selectedTrophy && (
        <div className="fixed bottom-5 right-5 z-20 hidden md:block">
          <div className="wood-walnut wood-panel-shadow inline-flex items-center gap-2 rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-xs font-semibold text-[#f3dfb8]">
            <Trophy className="h-4 w-4 text-[#f5b449]" />
            <span>Click any of the four trophies on the top shelf to inspect</span>
          </div>
        </div>
      )}

      {!isWebGLFallback && isProjectsArrived && !selectedProject && (
        <div className="fixed bottom-5 right-5 z-20 hidden md:block">
          <div className="wood-walnut wood-panel-shadow inline-flex items-center gap-2 rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-xs font-semibold text-[#f3dfb8]">
            <Gamepad2 className="h-4 w-4 text-[#f5b449]" />
            <span>Click any collectible on the desk shelf to inspect</span>
          </div>
        </div>
      )}

      {!isWebGLFallback && isSkillsArrived && !selectedSkillCategory && (
        <div className="fixed bottom-5 right-5 z-20 hidden md:block">
          <div className="wood-walnut wood-panel-shadow inline-flex items-center gap-2 rounded-xl border-2 border-[#b47c3c] px-4 py-2 text-xs font-semibold text-[#f3dfb8]">
            <Sword className="h-4 w-4 text-[#f5b449]" />
            <span>Click any of the four skill branches on the board to inspect</span>
          </div>
        </div>
      )}

      {!isWebGLFallback && isContactArrived && contactLetterStage === 'closed' && (
        <div className="fixed bottom-5 right-5 z-20 hidden md:block">
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

      {/* Compact wooden sound toggle HUD */}
      {isSceneReady && <AudioToggle />}

      {/* Fullscreen loading overlay while GLB downloads & initializes */}
      {!isWebGLFallback && (
        <LoadingScreen
          isSceneReady={isSceneReady}
          loadError={loadError}
          onOpenFallback={handleEnterFallback}
        />
      )}
    </main>
  );
}

export default App;
