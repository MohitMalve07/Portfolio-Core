import { useCallback, useEffect, useState } from 'react';
import type { TrophyId } from '../data/achievements';
import { NAVIGATION_ITEMS, type NavigationItem, type SectionId } from '../data/navigation';
import type { ProjectId } from '../data/projects';
import type { SkillCategoryId } from '../data/skills';

export type ContactLetterStage = 'closed' | 'revealing' | 'open';

export function useWorkshopNavigation(initialSection: SectionId | null = null) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(initialSection);
  const [arrivedSection, setArrivedSection] = useState<SectionId | null>(initialSection);
  const [selectedTrophyId, setSelectedTrophyId] = useState<TrophyId | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId | null>(null);
  const [selectedSkillCategoryId, setSelectedSkillCategoryId] =
    useState<SkillCategoryId | null>(null);
  const [contactLetterStage, setContactLetterStage] =
    useState<ContactLetterStage>('closed');
  const [isCameraTransitioning, setIsCameraTransitioning] = useState(false);

  const selectSection = useCallback((id: SectionId) => {
    setActiveSection((prev) => {
      // Do not restart transition or toggle off if the active section is clicked again
      if (prev === id) return prev;
      setArrivedSection(null);
      setSelectedTrophyId(null);
      setSelectedProjectId(null);
      setSelectedSkillCategoryId(null);
      setContactLetterStage('closed');
      return id;
    });
  }, []);

  const closeSection = useCallback(() => {
    setActiveSection(null);
    setArrivedSection(null);
    setSelectedTrophyId(null);
    setSelectedProjectId(null);
    setSelectedSkillCategoryId(null);
    setContactLetterStage('closed');
  }, []);

  const selectTrophy = useCallback((id: TrophyId) => {
    setSelectedTrophyId(id);
  }, []);

  const clearTrophy = useCallback(() => {
    setSelectedTrophyId(null);
  }, []);

  const selectProject = useCallback((id: ProjectId) => {
    setSelectedProjectId(id);
  }, []);

  const clearProject = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const selectSkillCategory = useCallback((id: SkillCategoryId) => {
    setSelectedSkillCategoryId(id);
  }, []);

  const clearSkillCategory = useCallback(() => {
    setSelectedSkillCategoryId(null);
  }, []);

  const openContactMailbox = useCallback(() => {
    setContactLetterStage((prev) => (prev === 'closed' ? 'revealing' : prev));
  }, []);

  const completeContactReveal = useCallback(() => {
    setContactLetterStage((prev) => (prev === 'revealing' ? 'open' : prev));
  }, []);

  const closeContactLetter = useCallback(() => {
    setContactLetterStage('closed');
  }, []);

  const handleTransitionStart = useCallback(() => {
    setIsCameraTransitioning(true);
  }, []);

  const handleTransitionComplete = useCallback((section: SectionId | null) => {
    setIsCameraTransitioning(false);
    setArrivedSection(section);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedTrophyId !== null) {
          setSelectedTrophyId(null);
        } else if (selectedProjectId !== null) {
          setSelectedProjectId(null);
        } else if (selectedSkillCategoryId !== null) {
          setSelectedSkillCategoryId(null);
        } else if (contactLetterStage !== 'closed') {
          setContactLetterStage('closed');
        } else {
          closeSection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    closeSection,
    selectedTrophyId,
    selectedProjectId,
    selectedSkillCategoryId,
    contactLetterStage,
  ]);

  const activeItem: NavigationItem | null =
    NAVIGATION_ITEMS.find((item) => item.id === activeSection) ?? null;

  return {
    activeSection,
    arrivedSection,
    activeItem,
    selectedTrophyId,
    selectedProjectId,
    selectedSkillCategoryId,
    contactLetterStage,
    isCameraTransitioning,
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
  };
}
