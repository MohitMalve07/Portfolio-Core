# Adventure Workshop — Interactive 3D Portfolio

An interactive 3D cabin workshop portfolio built with **React Three Fiber**, **Three.js**, **GSAP**, **TypeScript**, **Tailwind CSS**, and **Vite**, deployed at **[www.mohitmalve.in](https://www.mohitmalve.in/)**.

Instead of a conventional scrolling webpage, every section of the portfolio is anchored to a physical 3D object inside a stylized cabin environment with real-time lighting, custom GLSL emission/highlight shaders, particle effects, and spatial audio.

---

## Interactive Sections

1. **About Me (`BackWall_Corkboard`):** Zooms smoothly into the wall corkboard and presents an animated pinned ivory note card with background and education highlights.
2. **Experience (`Trophy_Shelf_Collection`):** Inspects four raycastable trophies and awards on the upper shelf with world-space shader emphasis (**Peblo**, **Smart Cookie Rewards**, **Unity Certified Associate: Programmer**, and **IJFMR Publication**).
3. **Projects (`Projects_optimized.glb`):** Isolates three clickable collectible models displayed on top of the workstation desk — **Van** (*Crash Course!*), **Chess Clock** (*3D Chess Prototype*), and **Racing Kart** (*Circuit Circus*) — linked to live itch.io demos and source repositories.
4. **Skills (`Skill_Tree_optimized.glb`):** Frames a wall-mounted 3D Skill Tree above the bed overlaid with 3D labels and interactive category branches (**Programming**, **Game Development**, **Multiplayer**, and **AR / VR & Tools**).
5. **Contact (`LetterBox_optimized.glb`):** Clickable fireplace mantel mailbox beside the lantern that reveals an animated parchment **Let's Connect!** letter connected asynchronously to Formspree (`VITE_FORMSPREE_ENDPOINT`).

---

## Atmosphere, Audio & Resilience

- **Real-Time Particle Effects:** Rising fireplace embers with flickering hearth light, gentle golden fireflies around both oil lanterns, orbiting desk character sparkles, and subtle cabin dust motes.
- **Cozy Audio System (`src/utils/workshopAudio.ts`):**
  - Looping ambient piano BGM (`public/audio/bgm.mp3`)
  - Spatialized fireplace crackle loop (`public/audio/fire_crackle.mp3`) that subtly adjusts volume based on camera distance from the hearth
  - Zero-latency Web Audio click SFX (`public/audio/click.wav`) on UI and 3D interactions
  - Bottom-left wooden sound toggle (`Enable Sound` / `Sound On` / `Sound Off`) respecting browser autoplay policies
- **Resilient WebGL + 2D Fallback:** Progressive WebGL renderer fallback (`powerPreference: 'default'`, MSAA toggle, low-power mode) paired with a complete **2D Interactive Workshop** fallback (`src/components/UI/Workshop2DFallback.tsx`, also reachable directly via `?view=2d`) when WebGL2 is blocked or unavailable.

---

## 3D Asset Production Optimization

All production `.glb` assets use **Meshopt** (`EXT_meshopt_compression`), attribute-preserving quadric decimation (`MeshoptSimplifier`), material/mesh deduplication, and tiered texture resolution scaling while preserving local vertex bounds required by `onBeforeCompile` shader masks.

| Asset | Original Size | Optimized Size | Size Reduction | Triangle Reduction |
| --- | ---: | ---: | ---: | ---: |
| Main Cabin (`adventurecabin_optimized.glb`) | 592.01 MiB | **21.67 MiB** | -96.34% | 16,124,087 → 674,086 |
| Projects (`Projects_optimized.glb`) | 24.99 MiB | **2.40 MiB** | -90.41% | 708,758 → 151,820 |
| Skill Tree (`Skill_Tree_optimized.glb`) | 59.16 MiB | **5.81 MiB** | -90.18% | 1,896,993 → 305,078 |
| LetterBox (`LetterBox_optimized.glb`) | 42.54 MiB | **3.06 MiB** | -92.80% | 1,243,098 → 267,998 |
| **Total** | **718.71 MiB** | **32.94 MiB** | **-95.42%** | **19,972,936 → 1,398,982** |

Full breakdown available in [`GLB_OPTIMIZATION_REPORT.md`](./GLB_OPTIMIZATION_REPORT.md).

---

## Tech Stack

- **Core:** React 19, TypeScript, Vite 8
- **3D & Animation:** Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP
- **Styling & Icons:** Tailwind CSS v4, Lucide React
- **Hosting & Forms:** Vercel (with immutable `/Models/*` & `/audio/*` caching via `vercel.json`), Formspree

---

## Project Structure

```text
Portfolio_Core/
├── public/
│   ├── Models/                  # Meshopt-compressed production GLB models
│   └── audio/                   # Looping BGM, fireplace crackle & UI click SFX
├── src/
│   ├── components/
│   │   ├── Scene/               # Canvas, camera controller, GLB loaders, effects
│   │   └── UI/                  # Wooden game menu, cards, sound toggle, 2D fallback
│   ├── data/                    # Camera anchors, projects, skills, achievements, contact
│   ├── hooks/                   # Workshop navigation & keyboard/ESC state
│   └── utils/                   # Web Audio & ambient sound controller
├── index.html
├── vercel.json
└── GLB_OPTIMIZATION_REPORT.md
```

---

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   Create `.env.local` in the project root with your Formspree form endpoint:
   ```env
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
   ```
3. **Run development server:**
   ```bash
   npm run dev
   ```
4. **Build and preview production bundle:**
   ```bash
   npm run build
   npm run preview
   ```
