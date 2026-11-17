import type { SkillCategoryId } from '../../data/skills';
import { SkillTreeModel } from './SkillTreeModel';

interface SkillsShowcaseProps {
  isInteractive: boolean;
  selectedCategoryId: SkillCategoryId | null;
  onSelectCategory: (id: SkillCategoryId) => void;
}

/**
 * Interactive Skills Showcase mounted on the cabin wall above the bed.
 */
export function SkillsShowcase({
  isInteractive,
  selectedCategoryId,
  onSelectCategory,
}: SkillsShowcaseProps) {
  return (
    <SkillTreeModel
      isInteractive={isInteractive}
      selectedCategoryId={selectedCategoryId}
      onSelectCategory={onSelectCategory}
    />
  );
}
