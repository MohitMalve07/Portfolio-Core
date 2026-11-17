export type SkillCategoryId =
  | 'programming'
  | 'gamedev'
  | 'multiplayer'
  | 'arvr-tools';

export interface SkillNodeLabel {
  id: string;
  label: string;
  /** Local coordinates inside Skill Tree.glb (x in [-0.49, 0.49], y in [0, 0.58]) */
  position: [number, number, number];
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
}

export interface SkillCategory {
  id: SkillCategoryId;
  title: string;
  plaqueLabel: string;
  plaquePosition: [number, number, number];
  /** Local hitbox center and [width, height] over the quadrant */
  hitboxCenter: [number, number, number];
  hitboxSize: [number, number];
  /** Local bounds used to highlight the quadrant's 3D meshes */
  quadrantBounds: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
  summary: string;
  skills: string[];
  relatedProjects: string[];
  nodes: SkillNodeLabel[];
}

export const SKILL_TREE_PLACEMENT = {
  position: [2.385, 1.38, 3.07] as [number, number, number],
  rotationY: -Math.PI / 2,
  scale: 1.25,
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming',
    title: 'Programming',
    plaqueLabel: 'PROGRAMMING',
    plaquePosition: [-0.291, 0.339, 0.031],
    hitboxCenter: [-0.255, 0.43, 0.042],
    hitboxSize: [0.41, 0.22],
    quadrantBounds: { xMin: -0.46, xMax: -0.05, yMin: 0.305, yMax: 0.555 },
    summary:
      'Strong object-oriented and gameplay systems programming foundation across C#, C++, and Python for real-time games and interactive tools.',
    skills: ['C#', 'C++', 'Python'],
    relatedProjects: ['Crash Course!', '3D Chess Prototype', 'Circuit Circus'],
    nodes: [
      { id: 'csharp', label: 'C#', position: [-0.222, 0.484, 0.049], align: 'left' },
      { id: 'cpp', label: 'C++', position: [-0.125, 0.484, 0.049], align: 'left' },
      { id: 'python', label: 'Python', position: [-0.104, 0.441, 0.049], align: 'left' },
    ],
  },
  {
    id: 'gamedev',
    title: 'Game Development',
    plaqueLabel: 'GAME DEVELOPMENT',
    plaquePosition: [0.29, 0.334, 0.031],
    hitboxCenter: [0.255, 0.43, 0.042],
    hitboxSize: [0.41, 0.22],
    quadrantBounds: { xMin: 0.05, xMax: 0.46, yMin: 0.305, yMax: 0.555 },
    summary:
      'End-to-end Unity gameplay engineering, vehicle and game physics, responsive UI systems, and 3D asset integration using Blender.',
    skills: [
      'Unity',
      'Blender',
      'Gameplay Programming',
      'Game Physics',
      'UI Systems',
    ],
    relatedProjects: ['Crash Course!', 'Circuit Circus', 'Peblo'],
    nodes: [
      { id: 'unity', label: 'Unity', position: [0.118, 0.492, 0.036], align: 'right' },
      { id: 'blender', label: 'Blender', position: [0.238, 0.506, 0.036], align: 'right' },
      {
        id: 'gameplay',
        label: 'Gameplay\nProgramming',
        position: [0.116, 0.436, 0.038],
        align: 'right',
      },
      {
        id: 'physics',
        label: 'Game Physics',
        position: [0.122, 0.391, 0.038],
        align: 'right',
      },
      {
        id: 'ui-systems',
        label: 'UI Systems',
        position: [0.338, 0.376, 0.038],
        align: 'left',
      },
    ],
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer',
    plaqueLabel: 'MULTIPLAYER',
    plaquePosition: [-0.293, 0.083, 0.031],
    hitboxCenter: [-0.255, 0.168, 0.042],
    hitboxSize: [0.41, 0.21],
    quadrantBounds: { xMin: -0.46, xMax: -0.05, yMin: 0.05, yMax: 0.28 },
    summary:
      'Online co-op and competitive multiplayer networking built with Unity Relay, Netcode synchronization, and cross-play WebGL + Windows builds.',
    skills: ['Unity Relay', 'Netcode', 'Multiplayer Systems', 'WebGL'],
    relatedProjects: ['Circuit Circus', 'Crash Course!'],
    nodes: [
      {
        id: 'unity-relay',
        label: 'Unity Relay',
        position: [-0.285, 0.242, 0.036],
        align: 'right',
      },
      {
        id: 'netcode',
        label: 'Netcode',
        position: [-0.188, 0.242, 0.036],
        align: 'left',
      },
      {
        id: 'mp-systems',
        label: 'Multiplayer\nSystems',
        position: [-0.112, 0.168, 0.036],
        align: 'left',
      },
      { id: 'webgl', label: 'WebGL', position: [-0.105, 0.122, 0.036], align: 'left' },
    ],
  },
  {
    id: 'arvr-tools',
    title: 'AR / VR & Tools',
    plaqueLabel: 'AR / VR & TOOLS',
    plaquePosition: [0.287, 0.084, 0.031],
    hitboxCenter: [0.255, 0.168, 0.042],
    hitboxSize: [0.41, 0.21],
    quadrantBounds: { xMin: 0.05, xMax: 0.46, yMin: 0.05, yMax: 0.28 },
    summary:
      'Spatial AR/VR prototyping with AR Foundation and Vuforia alongside modern development workflows using Git, Docker, and AWS.',
    skills: ['AR Foundation', 'Vuforia', 'Git', 'Docker', 'AWS'],
    relatedProjects: [
      'Smart Cookie Rewards',
      'AI-based Web App for Diet Planning and Recipe Generation',
    ],
    nodes: [
      {
        id: 'ar-foundation',
        label: 'AR Foundation',
        position: [0.205, 0.244, 0.036],
        align: 'right',
      },
      { id: 'vuforia', label: 'Vuforia', position: [0.305, 0.244, 0.036], align: 'left' },
      { id: 'git', label: 'Git', position: [0.145, 0.194, 0.036], align: 'right' },
      { id: 'docker', label: 'Docker', position: [0.145, 0.164, 0.036], align: 'right' },
      { id: 'aws', label: 'AWS', position: [0.162, 0.118, 0.036], align: 'right' },
    ],
  },
];

export function getSkillCategoryById(
  id: SkillCategoryId | null,
): SkillCategory | null {
  if (!id) return null;
  return SKILL_CATEGORIES.find((cat) => cat.id === id) ?? null;
}
