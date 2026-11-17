# GLB Production Optimization Audit Report

**Target File Audited:** [`public/Models/AdventureWorkshop_Lighting_Polish.glb`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/AdventureWorkshop_Lighting_Polish.glb)  
*(Note: No file named `adventurecabin polish.glb` exists in the workspace; `AdventureWorkshop_Lighting_Polish.glb` is the ~620 MB workshop GLB referenced by `src/components/Scene/WorkshopModel.tsx`, also present identically in the parent workspace root and `dist/Models/`.)*

**Audit Mode:** Strictly read-only (original GLB, `.blend`, and React Three Fiber sources were not modified).  
**Exporter Metadata:** `glTF 2.0` (`Khronos glTF Blender I/O v5.2.41`)  
**Extension Used:** `KHR_materials_emissive_strength` (`extensionsRequired: None`)

---

## Executive Summary

| Metric | Current Value | Notes |
| --- | --- | --- |
| **Total File Size** | **620,768,460 B** (`592.01 MiB`) | JSON chunk: `64,692 B` · BIN chunk: `620,703,740 B` (`591.95 MiB`) |
| **Scene Nodes / Meshes** | **41 nodes** / **38 meshes** | 3 mesh definitions already instanced across 6 nodes; 2 identical pairs un-instanced |
| **Total Geometry** | **16,124,087 tris** / **8,682,780 verts** | **`448.43 MiB`** (`470,209,968 B`) uncompressed vertex/index buffers (`75.7%` of GLB) |
| **Images / Textures** | **75 images** / **81 texture slots** | **`143.52 MiB`** (`150,493,661 B`) compressed PNG/JPEG (`24.2%` of GLB) |
| **Est. GPU Texture VRAM** | **`3,295.18 MiB` (~3.22 GiB)** | Estimated decoded `RGBA8 + mipmaps` (`w × h × 4 × 1.333`) |
| **Materials** | **44 materials** | 28 textured PBR, 16 scalar PBR; **4 exact duplicate material pairs** |
| **Animations / Cameras** | **0 / 0** | Pure static scene hierarchy |

**Root Causes of Bloat:**
1. **Tripo AI & High-Poly Raw Meshes (`448.43 MiB` / `16.12M` tris):** Just **9 props** contribute **13,813,574 triangles (85.67%)** and **`381.30 MiB`**, while another **15 desk/workstation props** contribute **2,305,129 triangles (14.30%)** and **`66.83 MiB`** (many capped at an artificial `120,000` triangles even for flat objects like `Desk_Mat` and `Rug`). All 14 architectural/small props combined take only `5,384` triangles (`0.31 MiB`).
2. **Oversized Embedded Textures (`143.52 MiB` disk / `3.22 GiB` VRAM):** `30` textures are **`4096×4096`** and `31` are **`2048×2048`** PNGs (all 55 PNGs are 8-bit RGB). Even small background or distant props (trash bin, outside pine trees, bedside pillows, oil lanterns) carry full `4K` maps.
3. **Zero GLTF Binary Compression:** No Draco (`KHR_draco_mesh_compression`), Meshopt (`EXT_meshopt_compression`), quantization (`KHR_mesh_quantization`), or KTX2 (`KHR_texture_basisu`) compression is enabled; `22` primitive index buffers still use `uint32` (`5125`).

**Projected Optimized GLB Size:** **`~15–24 MiB`** (a **96%–97.5% reduction** from `592.01 MiB`), with GPU VRAM dropping from **`~3,295 MiB`** to **`~180–320 MiB`** using KTX2 textures.

---

## 1. Mesh & Polygon/Triangle Count

- **Total Nodes:** `41` root scene nodes (flat hierarchy; `0` child chains, all directly listed in `Scene.nodes`).
- **Total Unique Mesh Definitions:** `38` (`48` total mesh primitives across all meshes).
- **Total Vertices:** `8,682,780`
- **Total Triangles:** `16,124,087`
- **Total Raw Geometry Buffer:** `470,209,968 B` (`448.43 MiB`) — all primitives use `['NORMAL', 'POSITION', 'TEXCOORD_0']` (`float32`), plus `22` `uint32` (`5125`) and `26` `uint16` (`5123`) index accessors. Zero unused accessors (`0`).

### Distribution by Density Tier

| Tier | Meshes | Triangles | % of Total Tris | Vertices | Raw Geometry BIN |
| --- | ---: | ---: | ---: | ---: | ---: |
| **Top 9 Mega-Meshes** (770k–1.97M tris each) | 9 | 13,813,574 | 85.67% | 7,314,208 | 381.30 MiB |
| **Mid 15 Workstation & Desk Props** (60k–391k tris each) | 15 | 2,305,129 | 14.30% | 1,359,416 | 66.83 MiB |
| **Bottom 14 Cabin Architecture & Small Props** (12–1,188 tris) | 14 | 5,384 | 0.03% | 9,156 | 0.31 MiB |
| **Total** | **38** | **16,124,087** | **100.00%** | **8,682,780** | **448.43 MiB** |

### Complete Mesh Inventory (All 38 Meshes, Ranked by Triangle Count)

| # | Mesh Name | Scene Node(s) | Tris | Verts | Raw BIN | Prims |
| ---: | --- | --- | ---: | ---: | ---: | ---: |
| 1 | `Cabin_Stone_Fireplace.001` | `Cabin_Stone_Fireplace` | 1,970,428 | 1,055,162 | 54.75 MiB | 1 |
| 2 | `Cabin_Bed.001` | `Cabin_Bed` | 1,968,038 | 1,040,159 | 54.27 MiB | 1 |
| 3 | `Exterior_Snow_Trees_1` | `Exterior_Snow_Trees_1`, `Exterior_Snow_Trees_2` *(shared)* | 1,950,566 | 1,015,292 | 53.31 MiB | 1 |
| 4 | `Trophy_Shelf_Collection` | `Trophy_Shelf_Collection` | 1,926,748 | 1,006,239 | 52.76 MiB | 1 |
| 5 | `Fireplace_Log_Pile.001` | `Fireplace_Log_Pile` | 1,915,347 | 1,016,142 | 52.93 MiB | 1 |
| 6 | `Fireplace_Floor_Pillows` | `Fireplace_Floor_Pillows` | 1,275,286 | 664,988 | 34.89 MiB | 1 |
| 7 | `DeskSide_Trash_Bin.001` | `DeskSide_Trash_Bin` | 1,058,564 | 555,752 | 29.07 MiB | 1 |
| 8 | `BackWall_Corkboard.001` | `BackWall_Corkboard` | 978,175 | 555,118 | 28.14 MiB | 1 |
| 9 | `Floor_Oil_Lantern.001` | `Floor_Oil_Lantern`, `Mantel_Oil_Lantern` *(shared)* | 770,422 | 405,356 | 21.19 MiB | 1 |
| 10 | `Desk_Book_Stack` | `Desk_Book_Stack` | 391,435 | 201,573 | 10.63 MiB | 1 |
| 11 | `Desk_Octopus_Plush.001` | `Desk_Octopus_Plush` | 299,423 | 153,832 | 8.12 MiB | 1 |
| 12 | `Desk_Cat_Lamp.001` | `Desk_Cat_Lamp` | 210,340 | 107,601 | 5.69 MiB | 1 |
| 13 | `Desk_Succulent_Left.001` | `Desk_Succulent_Left` | 142,205 | 76,457 | 3.96 MiB | 1 |
| 14 | `Desk_Succulent_Right.001` | `Desk_Succulent_Right` | 121,726 | 63,744 | 2.64 MiB | 1 |
| 15 | `Desk` | `Desk` | 120,000 | 96,050 | 4.30 MiB | 1 |
| 16 | `Keyboard` | `Keyboard` | 120,000 | 89,154 | 4.09 MiB | 1 |
| 17 | `Chair` | `Chair` | 120,000 | 88,665 | 4.08 MiB | 1 |
| 18 | `CPU_Case` | `CPU_Case` | 120,000 | 83,550 | 3.92 MiB | 1 |
| 19 | `Speaker_L` | `Speaker_L`, `Speaker_R` *(shared)* | 120,000 | 77,760 | 3.75 MiB | 1 |
| 20 | `Rug` | `Rug` | 120,000 | 74,813 | 3.66 MiB | 1 |
| 21 | `Monitor_2` | `Monitor_2` | 120,000 | 73,095 | 3.60 MiB | 1 |
| 22 | `Monitor_1` | `Monitor_1` | 120,000 | 69,364 | 3.49 MiB | 1 |
| 23 | `Desk_Mat` | `Desk_Mat` | 120,000 | 68,039 | 3.45 MiB | 1 |
| 24 | `Mouse` | `Mouse` | 60,000 | 35,719 | 1.43 MiB | 1 |
| 25 | `Cabin_Wall_Right_Logs.001` | `Cabin_Wall_Right_Logs` | 1,188 | 1,944 | 0.07 MiB | 1 |
| 26 | `Cabin_Wall_Left_Logs.001` | `Cabin_Wall_Left_Logs` | 880 | 1,440 | 0.05 MiB | 1 |
| 27 | `Cabin_Wall_Back_Logs.001` | `Cabin_Wall_Back_Logs` | 704 | 1,152 | 0.04 MiB | 1 |
| 28 | `Cabin_Floor_Planks.001` | `Cabin_Floor_Planks.001` | 648 | 1,296 | 0.04 MiB | 1 |
| 29 | `Fireplace_Mantel_Mug` | `Fireplace_Mantel_Mug` | 432 | 498 | 0.02 MiB | 3 |
| 30 | `Desk_Work_Mug` | `Desk_Work_Mug` | 432 | 498 | 0.02 MiB | 3 |
| 31 | `Ceiling_LightStrand_2` | `Ceiling_LightStrand_2` | 292 | 648 | 0.02 MiB | 3 |
| 32 | `Ceiling_LightStrand_1` | `Ceiling_LightStrand_1` | 292 | 648 | 0.02 MiB | 3 |
| 33 | `Cabin_Roof_Planks.001` | `Cabin_Roof_Planks` | 276 | 552 | 0.02 MiB | 1 |
| 34 | `Cabin_Roof_Rafters.001` | `Cabin_Roof_Rafters` | 96 | 192 | 0.01 MiB | 1 |
| 35 | `Cabin_Window_Frame.001` | `Cabin_Window_Frame` | 84 | 168 | 0.01 MiB | 1 |
| 36 | `Desk_Sticky_Notes` | `Desk_Sticky_Notes` | 36 | 72 | 0.00 MiB | 3 |
| 37 | `Fireplace_Floor_Cushions` | `Fireplace_Floor_Cushions` | 12 | 24 | 0.00 MiB | 1 |
| 38 | `Exterior_Snow_Ground.002` | `Exterior_Snow_Ground` | 12 | 24 | 0.00 MiB | 1 |

---

## 2. Texture Count, Dimensions, Formats & Memory Sizes

- **Unique Embedded Images:** `75` (`150,493,661 B` = `143.52 MiB` inside BIN chunk)
- **glTF `textures` Entries:** `81` (`6` shared-image references across `emissiveTexture` / `Desk_Cat_Lamp_Glow`)
- **Samplers:** `1` (`magFilter: 9729 LINEAR`, `minFilter: 9987 LINEAR_MIPMAP_LINEAR`)
- **Duplicate Image Blobs (exact MD5):** `0` (`0.00 MiB`)
- **Unused Images:** `0`
- **Formats:** `55` × `image/png` (all 8-bit RGB, `colorType = 2`, `bitDepth = 8`), `20` × `image/jpeg`
- **Total Estimated GPU Texture VRAM (decoded `RGBA8 + 1/3 mipmaps`):** **`3,295.18 MiB`** (`~3.22 GiB`)
  *(Per image: `4096×4096` = `85.33 MiB`, `2048×2048` = `21.33 MiB`, `1024×1024` = `5.33 MiB` GPU RAM regardless of PNG/JPEG disk size.)*

### Breakdown by Resolution, Format & PBR Map Role

| Resolution | Format | Map Slot(s) | Image Count | Embedded Size | Est. GPU VRAM (`RGBA+mips`) | Source / Asset Group |
| --- | --- | --- | ---: | ---: | ---: | --- |
| `4096×4096` | `image/png` | `normal` | 10 | 23.26 MiB | 853.33 MiB | 10 Tripo props (fireplace, bed, corkboard, etc.) |
| `4096×4096` | `image/jpeg` | `ORM` | 10 | 12.53 MiB | 853.33 MiB | Same 10 Tripo props |
| `4096×4096` | `image/jpeg` | `baseColor` | 7 | 11.13 MiB | 597.33 MiB | 7 Tripo props |
| `4096×4096` | `image/jpeg` | `baseColor + emissive` | 3 | 4.72 MiB | 256.00 MiB | Fireplace, Lanterns, Cute Object Set / Cat Lamp |
| **`4096×4096` Subtotal** | | | **30** | **51.64 MiB** | **2,560.00 MiB** | **`77.7%` of GPU VRAM!** |
| `2048×2048` | `image/png` | `ORM` | 10 | 31.86 MiB | 213.33 MiB | 10 workstation props (`model`..`model.009`) |
| `2048×2048` | `image/png` | `normal` | 10 | 28.34 MiB | 213.33 MiB | Same 10 workstation props |
| `2048×2048` | `image/png` | `baseColor` | 10 | 26.03 MiB | 213.33 MiB | Same 10 workstation props |
| `2048×2048` | `image/png` | `emissive` | 1 | 0.11 MiB | 21.33 MiB | `Mouse` (`model.004.emissive`) |
| **`2048×2048` Subtotal** | | | **31** | **86.35 MiB** | **661.33 MiB** | **`60.2%` of embedded image bytes!** |
| `1024×1024` | `image/png` | `baseColor` | 7 | 5.27 MiB | 37.33 MiB | 7 baked cabin architectural surfaces |
| `1024×1024` | `image/png` | `ORM` | 7 | 0.27 MiB | 37.33 MiB | 7 baked cabin architectural roughness maps |
| **`1024×1024` Subtotal** | | | **14** | **5.54 MiB** | **74.67 MiB** | Already compact on disk; KTX2 cuts VRAM |
| **Total** | | | **75** | **143.52 MiB** | **3,295.18 MiB** | |

**Key Texture Insight:**
- Notice the split bottleneck: **`2048×2048` PNGs (`model`..`model.009`) consume `86.35 MiB` (60.2%) of embedded file size** because `baseColor`, `normal`, and `ORM` are all stored as uncompressed/lossless PNGs (`~3–4.3 MiB` each), whereas **`4096×4096` Tripo maps consume `2,560 MiB` (77.7%) of GPU VRAM**!

---

## 3. Largest Individual Meshes & Textures

### Top 10 Largest Meshes (File Size / Triangle Burden)

1. `Cabin_Stone_Fireplace.001` — **1,970,428 tris** (`54.75 MiB` BIN + `5.87 MiB` 4K maps = `60.62 MiB`)
2. `Cabin_Bed.001` — **1,968,038 tris** (`54.27 MiB` BIN + `5.34 MiB` 4K maps = `59.61 MiB`)
3. `Exterior_Snow_Trees_1` *(+ `_2`)* — **1,950,566 tris** (`53.31 MiB` BIN + `5.66 MiB` 4K maps = `58.97 MiB`)
4. `Trophy_Shelf_Collection` — **1,926,748 tris** (`52.76 MiB` BIN + `5.74 MiB` 4K maps = `58.50 MiB`)
5. `Fireplace_Log_Pile.001` — **1,915,347 tris** (`52.93 MiB` BIN + `6.10 MiB` 4K maps = `59.03 MiB`)
6. `Fireplace_Floor_Pillows` — **1,275,286 tris** (`34.89 MiB` BIN + `4.35 MiB` 4K maps = `39.24 MiB`)
7. `DeskSide_Trash_Bin.001` — **1,058,564 tris** (`29.07 MiB` BIN + `3.73 MiB` 4K maps = `32.80 MiB`)
8. `BackWall_Corkboard.001` — **978,175 tris** (`28.14 MiB` BIN + `5.54 MiB` 4K maps = `33.68 MiB`)
9. `Floor_Oil_Lantern.001` *(+ `Mantel_Oil_Lantern`)* — **770,422 tris** (`21.19 MiB` BIN + `3.83 MiB` 4K maps = `25.02 MiB`)
10. `Desk_Book_Stack` — **391,435 tris** (`10.63 MiB` BIN, shares Tripo atlas with Cat Lamp / Octopus / Succulents)

### Top 15 Largest Embedded Images (Disk Size) & Top 4K VRAM Consumers

| Img # | Embedded Size | Dimensions & Format | GPU VRAM | Name | Material / Mesh |
| ---: | ---: | --- | ---: | --- | --- |
| 55 | **4.34 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_metallic-texture_roughness` | `model.003` (`Keyboard`) ORM |
| 66 | **4.23 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_normal` | `model.009` (`Rug`) normal |
| 37 | **4.22 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_metallic-texture_roughness` | `model.005` (`Desk_Mat`) ORM |
| 61 | **4.13 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_metallic-texture_roughness` | `model.002` (`Monitor_2`) ORM |
| 25 | **4.03 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_metallic-texture_roughness` | `model.007` (`Chair`) ORM |
| 24 | **3.94 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_diffuse` | `model.007` (`Chair`) baseColor |
| 30 | **3.92 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_diffuse` | `model` (`Desk`) baseColor |
| 59 | **3.89 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_normal` | `model.002` (`Monitor_2`) normal |
| 54 | **3.85 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_diffuse` | `model.003` (`Keyboard`) baseColor |
| 35 | **3.76 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_normal` | `model.005` (`Desk_Mat`) normal |
| 31 | **3.64 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_metallic-texture_roughness` | `model` (`Desk`) ORM |
| 47 | **3.55 MiB** | `4096×4096` PNG | **85.3 MiB** | `firewood_stack_3d_model_normal` | `tripo_material_f093...` (`Fireplace_Log_Pile`) normal |
| 67 | **3.44 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_diffuse` | `model.009` (`Rug`) baseColor |
| 23 | **3.24 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_normal` | `model.007` (`Chair`) normal |
| 58 | **3.07 MiB** | `2048×2048` PNG | 21.3 MiB | `texture_metallic-texture_roughness` | `model.001` (`Monitor_1`) ORM |

*(Notable VRAM outliers: all ten `4096×4096` normal PNGs — `img[0, 3, 13, 32, 38, 41, 44, 47, 51, 72]` — occupy `1.11–3.55 MiB` on disk but **`85.33 MiB` each** in GPU VRAM.)*

---

## 4. Material Count & Duplicated Materials

- **Total Materials:** `44` (`28` textured PBR materials + `16` scalar `baseColorFactor`/`roughnessFactor` PBR materials).
- **Exact Duplicate Material Definitions (identical properties & factors):** **4 pairs (4 redundant materials)**:
  1. `Metal_Black` (`Ceiling_LightStrand_1`) ≡ `Metal_Black.001` (`Ceiling_LightStrand_2`)
  2. `Wood_Walnut` (`Ceiling_LightStrand_1`) ≡ `Wood_Walnut.001` (`Ceiling_LightStrand_2`)
  3. `Ceramic_White` (`Fireplace_Mantel_Mug`) ≡ `Ceramic_White.001` (`Desk_Work_Mug`)
  4. `Cozy_Cocoa` (`Fireplace_Mantel_Mug`) ≡ `Cozy_Cocoa.005` (`Desk_Work_Mug`)
- **Multi-Texture Shared Image Groups (Good / Intentional):**
  - `tripo_material_964ae3a2-b5a1-4591-9851-0cc17a8c89ca` (`Desk_Book_Stack`, `Desk_Octopus_Plush`, `Desk_Succulent_Left`, `Desk_Succulent_Right`) already shares its 3 Tripo `4K` textures (`img[32..34]`) with `Desk_Cat_Lamp_Glow` (`Desk_Cat_Lamp`). **Do not merge these two material objects**: `Desk_Cat_Lamp_Glow` has `emissiveStrength: 2.2` and a dedicated luma mask shader in `WorkshopModel.tsx`.

---

## 5. Unused, Hidden, or Duplicate Objects

- **Orphaned/Unused Buffers, Images, Accessors, Materials:** `0` — every image (`75`), accessor (`180` across `180` geometry bufferViews), and material (`44`) is referenced by the single active `Scene`.
- **Hidden Nodes:** No glTF nodes are marked hidden/excluded from `Scene.nodes` (`41/41` nodes are present in `scenes[0].nodes`).
- **Already-Instanced Duplicate Objects (3 pairs sharing mesh data):**
  - `Exterior_Snow_Trees_1` & `Exterior_Snow_Trees_2` → share `mesh[25]` (`1,950,566` tris)
  - `Floor_Oil_Lantern` & `Mantel_Oil_Lantern` → share `mesh[30]` (`770,422` tris)
  - `Speaker_L` & `Speaker_R` → share `mesh[36]` (`120,000` tris)
- **Un-instanced Duplicate Geometry (2 pairs that SHOULD be instanced):**
  1. `Ceiling_LightStrand_1` & `Ceiling_LightStrand_2` — **byte-for-byte identical vertex `POSITION` hashes** (`292` tris / `3` prims each). Only separated because `Ceiling_LightStrand_2` uses `Metal_Black.001` / `Wood_Walnut.001`.
  2. `Fireplace_Mantel_Mug` & `Desk_Work_Mug` — **byte-for-byte identical vertex `POSITION` hashes** (`432` tris / `3` prims each). Only separated by `Ceramic_White.001` / `Cozy_Cocoa.005` + mug body color (`Mug_Terracotta` vs `Ceramic_Blue.001`).
- **Low-Visibility / Distant Exterior Geometry Overkill:**
  - `Exterior_Snow_Trees_1` / `Exterior_Snow_Trees_2` sit outside the cabin window (`x ≈ 5.3` and `6.8`) far from every section camera, yet carry **1,950,566 triangles** and **`4096×4096`** maps.
  - `DeskSide_Trash_Bin` (`1,058,564` tris + `4K` maps) sits under/beside the desk with no dedicated camera close-up.
  - `Cabin_Bed` (`1,968,038` tris + `4K` maps) only appears peripherally below the Skills wall mount.

---

## 6. Safely Optimizable Data & R3F Preservation Constraints

Before modifying geometry, materials, or textures, the following React Three Fiber (`src/`) hooks **must remain intact**:

### Strict Preservation Checklist (Do Not Break Website Interactions)

1. **Required Node Names (`rootName` / `getObjectByName`):**
   - `Trophy_Shelf_Collection` — looked up directly via `scene.getObjectByName('Trophy_Shelf_Collection')` in `TrophyShelf.tsx`.
   - `NO_SHADOW_CAST_NAMES` in `WorkshopModel.tsx`: `Ceiling_LightStrand_1`, `Ceiling_LightStrand_2`, `Desk_Cat_Lamp`, `Floor_Oil_Lantern`, `Mantel_Oil_Lantern`, `Exterior_Snow_Ground`, `Exterior_Snow_Trees_1`, `Exterior_Snow_Trees_2`.
   - Preserve all 41 node names and node world transforms (`translation`, `rotation`, `scale`) so section anchors (`cameraAnchors.ts`), `AboutMeCard.tsx`, `SkillTreeModel.tsx`, `LetterBoxModel.tsx`, `ProjectsShowcase.tsx`, and particle emitters (`EnvironmentalEffects.tsx`) stay perfectly aligned.
2. **Required Material Names (`WorkshopModel.tsx` `onBeforeCompile` Shader Masks):**
   - `tripo_material_47683ab6-e86c-49b7-9723-dadf38b7370a` (`Cabin_Stone_Fireplace`) — **CRITICAL:** shader reads local vertex `position` (`x ∈ [-0.135, 0.135]`, `y ∈ [0.155, 0.355]`, `z ∈ [-0.135, 0.045]`) and `emissiveColor` luma `(0.45..0.78)`. **Never apply transforms, re-center origin, or shift local mesh coordinates on `Cabin_Stone_Fireplace`!**
   - `tripo_material_47724856-1fe9-4d10-af67-bb28afea4f0e` (`Floor_Oil_Lantern.001` / `Mantel_Oil_Lantern`) — shader reads `emissiveColor` luma `(0.58..0.85)`.
   - `Desk_Cat_Lamp_Glow` (`Desk_Cat_Lamp`) — shader reads `emissiveColor` luma `(0.30..0.55)`. Keep separate from `tripo_material_964ae3a2-b5a1-4591-9851-0cc17a8c89ca`.
3. **World-Space Shader Bounds (`TrophyShelf.tsx` & `achievements.ts`):**
   - `TrophyShelf.tsx` highlights the 4 upper trophies using world-space vertex positions (`vTrophyWorldPos`). Keep `Trophy_Shelf_Collection` world bounds/placement and upper-shelf silhouette intact (`~100k–150k` tris is plenty; do not over-decimate the 4 trophy silhouettes).
4. **Do Not Modify Adjacent Scene Assets:** `Projects.glb`, `Skill Tree.glb`, and `LetterBox.glb` are loaded independently and positioned relative to the workshop coordinates.

---

## 7. Optimization Strategy & Target Budgets

### Phase A — Per-Mesh Safe Geometry Decimation (`16.12M` → `~580k–805k` tris, `-95%` to `-96%`)

Use silhouette- and UV-preserving simplification (Blender *Decimate* / *Planar* or `meshoptimizer` / `gltf-transform simplify` with locked boundaries and UV preservation) tiered by camera distance and hero status:

| Category | Target Meshes | Current Tris | Recommended Target Tris | Rationale |
| --- | --- | ---: | ---: | --- |
| **Hero Close-Up Interactive Props** | `Cabin_Stone_Fireplace`, `Trophy_Shelf_Collection`, `BackWall_Corkboard`, `Mantel_Oil_Lantern`/`Floor_Oil_Lantern` | 5,645,773 | **340,000 – 450,000** *(~80–120k each)* | Directly framed by About Me, Experience, and Contact cameras; preserves local flame firebox bounds & trophy silhouettes |
| **Midground Focal Furniture & Desk Gear** | `Desk_Book_Stack`, `Desk_Octopus_Plush`, `Desk_Cat_Lamp`, `Desk_Succulent_L/R`, `Desk`, `Keyboard`, `Chair`, `CPU_Case`, `Monitor_1/2`, `Speaker_L/R`, `Mouse` | 2,065,129 | **140,000 – 200,000** *(~10–25k each, ~4–8k for mouse/speakers/succulents)* | Framed in Projects & Overview shots; hard-surface props (`Monitors`, `Desk`, `CPU_Case`) simplify cleanly with zero visual loss |
| **Flat / Planar Subdivided Meshes** | `Desk_Mat` (120k), `Rug` (120k) | 240,000 | **1,000 – 4,000** *(~500–2k each)* | Visually nearly flat surfaces artificially capped at 120k tris |
| **Heavy Background Props** | `Cabin_Bed` (1.97M), `Fireplace_Log_Pile` (1.92M), `Fireplace_Floor_Pillows` (1.28M), `DeskSide_Trash_Bin` (1.06M) | 6,217,235 | **70,000 – 110,000** *(~15–35k each)* | Soft organic / occluded props never centered in close-up section cameras |
| **Distant Exterior Foliage** | `Exterior_Snow_Trees_1` *(+ `_2`)* | 1,950,566 | **25,000 – 40,000** | Viewed far outside the cabin window (`x > 5m`) |
| **Architecture & Small Props** | Remaining 14 meshes (`Walls`, `Floor`, `Roof`, `Mugs`, `LightStrands`, `StickyNotes`, etc.) | 5,384 | **~4,660** *(leave as-is)* | Already optimal (`0.03%` of tris); only share `LightStrand` & `Mug` geometry |
| **Total Geometry** | **All 38 → 36 unique meshes** | **16,124,087** | **~580,000 – 805,000** | **~16–22 MiB raw BIN** (before compression) |

*(Note: Verify `uint16` vs `uint32` indices — once each mesh drops below 65,535 vertices, all index buffers automatically fit in `uint16`, cutting index size in half.)*

### Phase B — Texture Downscaling & KTX2 (`KHR_texture_basisu`) Compression

1. **Resolution Tiers (by screen-space texel density):**
   - **Keep `2048×2048` (Hero Close-Ups only):** `BackWall_Corkboard`, `Trophy_Shelf_Collection`, `Cabin_Stone_Fireplace`, `cute_object_set` atlas (`Desk_Cat_Lamp` / `Octopus` / `Book_Stack`), and `Desk` / `Keyboard` / `Monitor_1` / `Monitor_2`. *(Cutting 4K Tripo hero maps to 2K reduces VRAM by **75%** per texture while exceeding 1:1 viewport pixel density on 1080p–1440p displays.)*
   - **Resize to `1024×1024` (Midground Props & Cabin Shells):** `Cabin_Bed`, `Fireplace_Log_Pile`, `Fireplace_Floor_Pillows`, `Floor_Oil_Lantern` / `Mantel_Oil_Lantern`, `Chair`, `Desk_Mat`, `Rug`, `CPU_Case`, plus keep existing `1024×1024` `Baked_Cabin_*` maps.
   - **Resize to `512×512` (Distant / Small / Low-Contrast Props):** `Exterior_Snow_Trees`, `DeskSide_Trash_Bin`, `Speaker_L/R`, `Mouse` (including `Mouse.emissive` currently taking `21.3 MiB` VRAM at 2K for a `0.11 MiB` PNG!).
2. **Format Conversion — Prefer KTX2 (Basis Universal) over Raw PNG:**
   - **`baseColor` & `emissive` → `KTX2 ETC1S`** (`gltf-transform etc1s --quality 192` or `220`): compact file size (`~0.15–0.45 MiB` at 2K, `~0.04–0.12 MiB` at 1K) and GPU-native compressed upload.
   - **`normal` & `ORM` (`metallicRoughness`) → `KTX2 UASTC + Zstandard`** (`gltf-transform uastc --level 3 --zstd 18`): preserves tangent-space normal precision and separate R/G/B PBR channels without ETC1S block artifacts.
   - *(Fallback if staying PNG/WebP without KTX2 transcoder: `gltf-transform webp` shrinks PNGs by ~70–85% on disk, though decoded GPU VRAM remains uncompressed RGBA8.)*
3. **Material & Mesh Deduplication (`gltf-transform dedup`):**
   - Merge `Metal_Black.001` → `Metal_Black`, `Wood_Walnut.001` → `Wood_Walnut`, `Ceramic_White.001` → `Ceramic_White`, `Cozy_Cocoa.005` → `Cozy_Cocoa` (`44` → `40` materials).
   - Instance shared geometry between `Ceiling_LightStrand_1` & `_2` and `Fireplace_Mantel_Mug` & `Desk_Work_Mug` while keeping distinct node names and material slots.

### Phase C — Geometry Compression (`EXT_meshopt_compression` or `KHR_draco_mesh_compression`)

- **Option 1 (Recommended for Fast Decode & Meshoptimizer Synergy): `Meshopt` (`EXT_meshopt_compression` + `KHR_mesh_quantization`)**
  - Quantizes positions (16-bit), normals (octahedral 8/10-bit), and UVs (12–16-bit), reorders vertices for GPU cache locality, and compresses tightly (`~3–6 MiB` decode overhead is minimal).
- **Option 2 (Built-in Drei Support): `Draco` (`KHR_draco_mesh_compression`)**
  - Supported directly via `@react-three/drei`'s `useGLTF(path, true)`. Typically achieves ~30–40% smaller geometry bytes than Meshopt (`~2.5–5 MiB` at `600k` tris), at a slightly higher main-thread WASM decode cost on load.

---

## 8. Estimated Achievable Compressed GLB Size

| Pipeline Stage | Geometry Disk Size | Textures Disk Size | Total GLB File Size | Est. GPU Texture VRAM |
| --- | ---: | ---: | ---: | ---: |
| **Current Unoptimized GLB** | `448.43 MiB` (`16.12M` tris) | `143.52 MiB` (75 PNG/JPG) | **`592.01 MiB`** | **`3,295.18 MiB`** (`~3.22 GiB`) |
| **1. Compression Only** (no decimation/resize) | `~45–75 MiB` *(Draco/Meshopt)* | `~55–75 MiB` *(WebP/KTX2 at 2K/4K)* | `~105–150 MiB` *(still fails mobile VRAM)* | `~500–3,295 MiB` |
| **2. Safe Decimation + Resize + WebP** *(zero shader/transcoder changes)* | **`~3.5–7.5 MiB`** *(Draco/Meshopt, ~600k–750k tris)* | **`~16–24 MiB`** *(2K hero / 1K mid / 512 dist)* | **`~20–32 MiB`** *(-95%)* | **`~480–620 MiB`** *(-81%)* |
| **3. Recommended Production Target: Safe Decimation + Resize + KTX2 (UASTC/ETC1S) + Draco/Meshopt** | **`~3.5–7.5 MiB`** | **`~11–16 MiB`** *(ETC1S albedo + UASTC norm/ORM)* | **`~15–23 MiB`** *(-96% to -97.5%)* | **`~180–310 MiB`** *(-91% to -94%)* |

### Recommended Next Execution Pipeline (When Ready to Optimize)

1. Export/decimate the 24 dense meshes in Blender (or scripted `meshoptimizer` / `gltf-transform`) on a **copy** while keeping `Cabin_Stone_Fireplace` local coordinates/origin untouched and preserving all node/material names.
2. Run deduplication, texture tier resizing, KTX2 conversion (`ETC1S` for `baseColor`/`emissive`, `UASTC + zstd` for `normal`/`ORM`), and `Draco` or `Meshopt` compression via `@gltf-transform/cli`.
3. Configure R3F (`WorkshopModel.tsx`) with KTX2/Meshopt or Draco loader support (`useGLTF(WORKSHOP_MODEL_PATH, true)` for Draco, plus `KTX2Loader` if using KTX2).
4. Visually A/B verify every section camera (`Overview`, `About Me`, `Experience`, `Projects`, `Skills`, `Contact`) and shader mask (`Cabin_Stone_Fireplace`, `Oil_Lantern`, `Desk_Cat_Lamp_Glow`, `Trophy_Shelf_Collection`) in the browser before replacing the production asset.

---

## 9. Implemented Production Optimization Results

All four portfolio `.glb` assets were optimized non-destructively into separate `*_optimized.glb` files inside [`public/Models/`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/), preserving all original `.glb` files untouched as backups. React Three Fiber loaders ([WorkshopModel.tsx](file:///D:/Portfolio%20Website/Portfolio_Core/src/components/Scene/WorkshopModel.tsx), [ProjectsShowcase.tsx](file:///D:/Portfolio%20Website/Portfolio_Core/src/components/Scene/ProjectsShowcase.tsx), [SkillTreeModel.tsx](file:///D:/Portfolio%20Website/Portfolio_Core/src/components/Scene/SkillTreeModel.tsx), [LetterBoxModel.tsx](file:///D:/Portfolio%20Website/Portfolio_Core/src/components/Scene/LetterBoxModel.tsx)) were updated to load the optimized assets using `@react-three/drei`'s bundled `MeshoptDecoder`.

### Original vs. Optimized File Sizes, Polygon Counts & VRAM

| Asset | Original Size | Optimized Size | Reduction | Triangles | Vertices | Texture Disk / VRAM (`RGBA+mips`) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [`adventurecabin_optimized.glb`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/adventurecabin_optimized.glb) *(from `AdventureWorkshop_Lighting_Polish.glb`)* | **592.01 MiB**<br>(`620,768,460 B`) | **21.67 MiB**<br>(`22,722,936 B`) | **-96.34%** | `16,124,087` → **`674,086`**<br>(`-95.82%`) | `8,682,780` → **`568,500`** | `143.52 MiB` → **`14.20 MiB`**<br>VRAM: `3,296.0 MiB` → **`620.0 MiB`** |
| [`Projects_optimized.glb`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/Projects_optimized.glb) *(from `Projects.glb`)* | **24.99 MiB**<br>(`26,206,560 B`) | **2.40 MiB**<br>(`2,513,464 B`) | **-90.41%** | `708,758` → **`151,820`**<br>(`-78.58%`) | `496,846` → **`160,186`** | `1.72 MiB` → **`0.84 MiB`**<br>VRAM: `64.0 MiB` → **`32.0 MiB`** |
| [`Skill_Tree_optimized.glb`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/Skill_Tree_optimized.glb) *(from `Skill Tree.glb`)* | **59.16 MiB**<br>(`62,038,756 B`) | **5.81 MiB**<br>(`6,093,636 B`) | **-90.18%** | `1,896,993` → **`305,078`**<br>(`-83.92%`) | `1,378,736` → **`328,286`** | `3.42 MiB` → **`1.40 MiB`**<br>VRAM: `92.77 MiB` → **`52.77 MiB`** |
| [`LetterBox_optimized.glb`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/LetterBox_optimized.glb) *(from `LetterBox.glb`)* | **42.54 MiB**<br>(`44,603,352 B`) | **3.06 MiB**<br>(`3,213,208 B`) | **-92.80%** | `1,243,098` → **`267,998`**<br>(`-78.44%`) | `881,586` → **`289,777`** | `1.40 MiB` → **`0.42 MiB`**<br>VRAM: `64.0 MiB` → **`16.0 MiB`** |
| **Combined Portfolio Total** | **718.71 MiB**<br>(`753,617,128 B`) | **32.94 MiB**<br>(`34,543,244 B`) | **-95.42%** | `19,972,936` → **`1,398,982`**<br>(`-93.00%`) | `11,439,948` → **`1,346,749`** | `150.07 MiB` → **`16.86 MiB`**<br>VRAM: `3,516.77 MiB` → **`720.77 MiB`** |

### Compression & Optimization Techniques Applied

1. **Attribute-Aware Geometry Simplification (`MeshoptSimplifier`):**
   - Decimated high-poly Tripo/stylized meshes via `MeshoptSimplifier.simplifyWithAttributes` preserving `NORMAL` and `TEXCOORD_0` attributes in original `Float32Array` local coordinate space (`maxErr = 0.00780` on `adventurecabin_optimized.glb`; `maxErr <= 0.02498` across secondary GLBs).
   - Preserved `Cabin_Stone_Fireplace` local origin & firebox vertices (`1,967` flame-region vertices intact), `Trophy_Shelf_Collection` silhouette, `Projects_optimized.glb` spatial triangle islands (`Van`: `52,310`, `ChessClock`: `48,302`, `RacingKart`: `51,208` tris), and all 13 low-poly architectural/small cabin meshes (`0` decimation).
   - Compacted vertices via `MeshoptSimplifier.compactMesh` (vertex-fetch cache optimization) and switched all `<= 65,535`-vertex primitives from `Uint32` (`5125`) to `Uint16` (`5123`) index buffers.
2. **Binary Mesh Compression (`EXT_meshopt_compression`):**
   - Compressed every `POSITION`, `NORMAL`, `TEXCOORD_0`, and `indices` `bufferView` via `MeshoptEncoder` (`EXPONENTIAL` filter: `16`-bit `SharedComponent` for positions/UVs, `12`-bit `SharedVector` for normals; `ATTRIBUTES` / `TRIANGLES` modes).
   - Avoided `KHR_mesh_quantization` integer rescaling so shader masks in `WorkshopModel.tsx` (`vFireplaceLocalPos`), CPU bounds slicing in `ProjectsShowcase.tsx`, and quadrant bounds checks in `SkillTreeModel.tsx` continue operating directly in exact meter coordinates.
   - Main cabin raw post-decimation geometry (`21.83 MiB`) compresses to **`7.38 MiB`**.
3. **Deduplication & Instancing (`adventurecabin_optimized.glb`):**
   - Merged 4 exact duplicate materials (`44 → 40`): `Metal_Black.001` → `Metal_Black`, `Wood_Walnut.001` → `Wood_Walnut`, `Ceramic_White.001` → `Ceramic_White`, `Cozy_Cocoa.005` → `Cozy_Cocoa`.
   - Deduplicated shared-image texture entries (`81 → 75`) and instanced `Ceiling_LightStrand_2` onto `Ceiling_LightStrand_1`'s mesh (`38 → 37` unique meshes).
4. **Tiered Texture Resizing & Chromatic Preservation:**
   - **Cabin (`75` images, `30 × 4K` + `31 × 2K` + `14 × 1K` → `17 × 2K` + `45 × 1K` + `13 × 512`):** Hero close-ups (`BackWall_Corkboard`, `Cabin_Stone_Fireplace`, `Trophy_Shelf_Collection`, `Desk_Cat_Lamp`/`cute_object_set`, `Floor_Oil_Lantern`/`Mantel_Oil_Lantern` baseColor, `Desk`/`Keyboard`/`Monitor_1`/`Monitor_2` baseColor) resized with `LANCZOS` to `2048×2048`; midground/architectural textures at `1024×1024`; small/distant props (`Exterior_Snow_Trees`, `DeskSide_Trash_Bin`, `Speaker_L/R`, `Mouse`) at `512×512`.
   - Normal/ORM maps and emission-masked baseColor maps (`Cabin_Stone_Fireplace`, `Oil_Lantern`, `Desk_Cat_Lamp_Glow`) encoded with `subsampling=0` (`4:4:4`) JPEG to preserve tangent normals and shader luminance thresholds; already tiny PNG roughness maps (`Baked_Cabin_*`) retained whenever re-encoding did not save bytes.
   - **Secondary Assets:** `Projects_optimized.glb` (`2K` baseColor + `1K` normal/ORM), `Skill_Tree_optimized.glb` (`4 × 1K` → `512×512`, `109` images `3.42 → 1.40 MiB`), `LetterBox_optimized.glb` (`2K` → `1024×1024`).

### Build & Live Browser Verification

- **Production Build:** `npm run build` (`tsc -b && vite build`) exited with code `0` (`dist/assets/index-_VqJllOt.js` `1,757.68 kB`).
- **Node Decoder Check:** `MeshoptDecoder` cleanly decoded all `EXT_meshopt_compression` bufferViews (`175` cabin, `4` projects, `436` skill tree, `4` letterbox) with `0` errors.
- **Browser Inspection (`http://localhost:4173`):**
  - `0` console errors, `0` failed requests, all four `*_optimized.glb` HTTP 200.
  - Visually verified Overview cabin lighting, silhouettes, textures, wood planks, cat lamp aura, oil lantern emission/particles, dual monitors/desk collectibles, snow trees, trophy shelf, and string lights.
  - Verified all 5 navigation transitions and interactions: **1. About Me** (corkboard pinned paper note), **2. Experience** (trophy click + Smart Cookie Rewards card), **3. Projects** (Van click + Crash Course card), **4. Skills** (Skill Tree 3D labels + Programming quadrant highlight & card), **5. Contact** (LetterBox beside glowing mantel lantern + Let's Connect modal), and **Back to Workshop**.

### Remaining Optimization Opportunities

1. **Exclude Backup Originals from Deployment Bundle:** The unoptimized backup `.glb` files (`~718.7 MiB`) remain inside [`public/Models/`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/) as backups. Before deploying to a static host with file-size limits, move those 4 original backups outside `public/` (e.g. `backups/Models/`) so `vite build` only copies the `32.94 MiB` optimized `.glb` files into `dist/Models/`.
2. **KTX2 (`KHR_texture_basisu`) GPU Compression:** Installing `@gltf-transform/cli` + `toktx` and encoding textures as KTX2 (`ETC1S` albedo + `UASTC` normal/ORM) with `KTX2Loader` configured on `useGLTF` can cut GPU texture VRAM another ~60–75% (`620 MiB` → `~180–250 MiB` on mobile/4 GB GPUs).
3. **Skill Tree Draw-Call Atlasing:** [`Skill_Tree_optimized.glb`](file:///D:/Portfolio%20Website/Portfolio_Core/public/Models/Skill_Tree_optimized.glb) still uses `109` separate meshes/materials (`109` images); packing those small textures into 1–4 shared atlases grouped by quadrant (`< 0.34m` center bounds preserved for `SkillTreeModel.tsx`) would eliminate ~105 draw calls.
4. **Mug Mesh Instancing:** `Fireplace_Mantel_Mug` and `Desk_Work_Mug` share identical `432`-triangle geometry and could share one mesh via material variant overrides if desired.
