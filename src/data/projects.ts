export type ProjectId = 'crash-course' | 'chess-prototype' | 'circuit-circus';

export type ProjectObjectName = 'Van' | 'ChessClock' | 'RacingKart';

export interface ProjectInfo {
  id: ProjectId;
  objectName: ProjectObjectName;
  objectLabel: string;
  title: string;
  description: string;
  playUrl: string;
  githubUrl: string | null;
  githubStatusLabel?: string;
  /** Placement on the workstation desk upper shelf (y = 1.804) */
  position: [number, number, number];
  rotationY: number;
  scale: number;
}

export const PROJECTS: ProjectInfo[] = [
  {
    id: 'crash-course',
    objectName: 'Van',
    objectLabel: 'Van',
    title: 'Crash Course!',
    description:
      'A cooperative driving game where two players control a single vehicle using split controls. One player handles steering while the other manages acceleration, braking and gears.',
    playUrl: 'https://mtgking.itch.io/crash-course',
    githubUrl: null,
    githubStatusLabel: 'Coming Soon',
    position: [0.9, 1.804, -0.26],
    rotationY: 0.36,
    scale: 0.42,
  },
  {
    id: 'chess-prototype',
    objectName: 'ChessClock',
    objectLabel: 'Chess Clock',
    title: '3D Chess Prototype',
    description:
      'A 3D chess game featuring an AI opponent and an interactive chess experience.',
    playUrl: 'https://mtgking.itch.io/chessprototype',
    githubUrl: 'https://github.com/MohitMalve07/ProtoChess3D',
    position: [1.13, 1.804, -0.28],
    rotationY: -0.05,
    scale: 0.43,
  },
  {
    id: 'circuit-circus',
    objectName: 'RacingKart',
    objectLabel: 'Racing Kart',
    title: 'Circuit Circus',
    description:
      'A multiplayer kart racing game featuring online multiplayer, vehicle controls, checkpoints, lap tracking and Unity Relay integration.',
    playUrl: 'https://mtgking.itch.io/circuit-circus',
    githubUrl: 'https://github.com/MohitMalve07/CircuitCircus',
    position: [1.35, 1.804, -0.25],
    rotationY: -0.38,
    scale: 0.44,
  },
];

export function getProjectById(id: ProjectId | null): ProjectInfo | null {
  if (!id) return null;
  return PROJECTS.find((p) => p.id === id) ?? null;
}
