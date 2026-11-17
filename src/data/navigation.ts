export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact';

export interface NavigationItem {
  id: SectionId;
  order: number;
  label: string;
  iconName: 'id-card' | 'briefcase' | 'hammer' | 'sword' | 'mail';
  subtitle: string;
  milestoneNote: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'about',
    order: 1,
    label: 'About Me',
    iconName: 'id-card',
    subtitle: 'Workshop Keeper & Background',
    milestoneNote:
      'Foundation shell ready. Personal story, focus areas, and workshop introduction will be populated in the next phase.',
  },
  {
    id: 'experience',
    order: 2,
    label: 'Experience',
    iconName: 'briefcase',
    subtitle: 'Journey & Craft Timeline',
    milestoneNote:
      'Foundation shell ready. Roles, teams, and milestones will be connected here in the content phase.',
  },
  {
    id: 'projects',
    order: 3,
    label: 'Projects',
    iconName: 'hammer',
    subtitle: 'Workbench Creations & Builds',
    milestoneNote:
      'Foundation shell ready. Interactive project showcases and case studies will live here and tie into the workstation props.',
  },
  {
    id: 'skills',
    order: 4,
    label: 'Skills',
    iconName: 'sword',
    subtitle: 'Tools, Stack & Specialties',
    milestoneNote:
      'Foundation shell ready. Technical disciplines, tools, and proficiency groups will be added here next.',
  },
  {
    id: 'contact',
    order: 5,
    label: 'Contact',
    iconName: 'mail',
    subtitle: 'Send a Dispatch',
    milestoneNote:
      'Foundation shell ready. Direct links and message channels will be configured in the upcoming milestone.',
  },
];
