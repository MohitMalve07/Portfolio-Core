export type TrophyId = 'peblo' | 'smart-cookie' | 'unity-cert' | 'publication';

export interface TrophyBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
}

export interface TrophyAchievement {
  id: TrophyId;
  trophyLabel: string;
  category: 'Experience' | 'Certification' | 'Publication';
  title: string;
  subtitle?: string;
  periodLabel: string;
  details: string[];
  /** Exact world-space bounds derived from Trophy_Shelf_Collection in the GLB. */
  bounds: TrophyBounds;
  center: [number, number, number];
  size: [number, number, number];
}

export const TROPHY_ACHIEVEMENTS: TrophyAchievement[] = [
  {
    id: 'peblo',
    trophyLabel: 'Trophy 1 — Peblo',
    category: 'Experience',
    title: 'Peblo',
    subtitle: 'Unity Game Developer Intern, Remote',
    periodLabel: 'February 2026 – Dec 2026',
    details: [
      'Develop gameplay features and UI systems for interactive educational games built in Unity.',
      'Integrate assets and gameplay mechanics, working with the team on implementation and testing.',
    ],
    bounds: {
      xMin: 2.206,
      xMax: 2.31,
      yMin: 2.125,
      yMax: 2.294,
      zMin: -0.441,
      zMax: -0.275,
    },
    center: [2.258, 2.21, -0.358],
    size: [0.125, 0.185, 0.175],
  },
  {
    id: 'smart-cookie',
    trophyLabel: 'Trophy 2 — Smart Cookie Rewards',
    category: 'Experience',
    title: 'Smart Cookie Rewards',
    subtitle: 'Game Developer Intern, Pune',
    periodLabel: 'July 2024 – October 2024',
    details: [
      'Implemented core game features in Unity C# and integrated game assets.',
      'Refined gameplay mechanics to meet project milestones.',
    ],
    bounds: {
      xMin: 2.196,
      xMax: 2.32,
      yMin: 2.125,
      yMax: 2.357,
      zMin: -0.16,
      zMax: 0.045,
    },
    center: [2.258, 2.241, -0.057],
    size: [0.14, 0.245, 0.21],
  },
  {
    id: 'unity-cert',
    trophyLabel: 'Trophy 3 — Unity Certification',
    category: 'Certification',
    title: 'Unity Certified Associate: Programmer',
    subtitle: 'Unity Certification',
    periodLabel: 'Year: 2026',
    details: [],
    bounds: {
      xMin: 2.211,
      xMax: 2.304,
      yMin: 2.125,
      yMax: 2.428,
      zMin: 0.045,
      zMax: 0.205,
    },
    center: [2.257, 2.276, 0.125],
    size: [0.12, 0.315, 0.165],
  },
  {
    id: 'publication',
    trophyLabel: 'Trophy 4 — Publication',
    category: 'Publication',
    title: 'AI-based Web App for Diet Planning and Recipe Generation',
    subtitle: 'Published in: IJFMR',
    periodLabel: 'Year: 2024',
    details: [],
    bounds: {
      xMin: 2.199,
      xMax: 2.317,
      yMin: 2.125,
      yMax: 2.332,
      zMin: 0.205,
      zMax: 0.375,
    },
    center: [2.258, 2.228, 0.29],
    size: [0.135, 0.22, 0.175],
  },
];

export function getTrophyById(id: TrophyId | null): TrophyAchievement | null {
  if (!id) return null;
  return TROPHY_ACHIEVEMENTS.find((t) => t.id === id) ?? null;
}
