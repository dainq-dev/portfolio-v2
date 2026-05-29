# Brainstorming Session: 3D Portfolio Parallax (React 19 + GSAP + Three.js)

**Date**: 2026-05-30
**Technique(s) used**: Classic Brainstorm, Analogy/Metaphor (telling a story via scroll), Multi-Perspective

## Phase 1: Frame the Problem

**Problem Statement:**
Create a highly interactive, 2.5D scroll-driven 3D portfolio using React 19, GSAP, and Three.js that dynamically presents Nguyen Quoc Dai's resume (Full-Stack Engineer) in a storyline format, from sitting at a desk to walking through career milestones.

**Success Criteria:**
- **Performance:** Smooth 60fps scrolling and 3D rendering; loading screen successfully preloads heavy 3D assets.
- **Visual/UX:** 2.5D parallax effect feels natural. The transition from "sitting at a desk" to "standing/waving" and walking through the timeline works seamlessly via GSAP ScrollTrigger.
- **Tech Stack:** React 19, GSAP (ScrollTrigger, Timeline), Three.js (React Three Fiber/Drei), Bun, Biome, deployed on Vercel.
- **Content:** Accurately reflects the parsed `resume.json` data (skills grouped by category, projects split by Full-Stack/Team Lead, etc.).

**Assumptions & Constraints:**
- *Assumption:* We have or can find/create the 3D assets (a character model of Dai, a desk, monitors, milestone markers like company buildings or signposts).
- *Assumption:* The user is okay with using React Three Fiber (`@react-three/fiber`) as the bridge between React 19 and Three.js, as it is the industry standard for React+Three.js.
- *Constraint:* 3D models can be heavy; we must optimize them (GLTF/GLB formats, Draco compression) so the initial loading screen doesn't take too long.

---

## Phase 2 & 3: Generate Ideas & Facilitation

### Theme 1: 3D Scene Architecture & Asset Management
- **Idea 1.1:** Use a single continuous 3D scene (Canvas) covering the entire screen (`100vw`, `100vh`, `fixed`). HTML content (React components for text/UI) overlays the canvas and moves based on scroll.
- **Idea 1.2:** The 3D Camera is the primary driver of the parallax effect. GSAP ScrollTrigger maps the user's scroll progress to a GSAP Timeline that animates the Camera's `position` and `lookAt`.
- **Idea 1.3:** The "2.5D" feel can be achieved by using a mix of true 3D objects (the character, desk) and 2D billboard planes (planes that always face the camera) for project thumbnails and skill icons.

### Theme 2: The Scroll Storyline (Section by Section)
- **Loading:** A stylized terminal or code-compiling screen. Progress bar from 0 to 100% tied to Three.js `useProgress()`.
- **Hero:** Camera focuses on the back/side of the 3D character typing. Screens emit light (Bloom effect). As the user scrolls, the camera swings around to the front, the character plays a "stand up and wave" animation.
- **About Me:** The camera pulls back. Floating 3D text or HTML overlay reveals the "Professional Summary".
- **Experience (Career Timeline):** The character starts walking along a path. The camera follows. Milestones (FIDT, Vietstats, Doctor Check) appear along the path. We can use GSAP `MotionPathPlugin` or animate character position along a curve.
- **Skills:** The character stops at a "Tech Hub" area. Skill categories (Languages, Frontend, AI/LLM, etc.) float around. Hovering an HTML invisible div triggers a GSAP animation that expands the specific skill group 3D nodes or 2D HTML tooltips.
- **Projects:** A gallery corridor. Project thumbnails are 3D frames or 2.5D planes. Categorized by "Full-Stack Engineer" and "Team Lead". Hovering triggers a WebGL distortion effect or flips the frame to show details.
- **Contact:** The end of the path. Character points to a floating contact form or terminal.

### Theme 3: Technical Implementation Details
- **React 19 + GSAP:** Use the new `@gsap/react` `useGSAP` hook for safe cleanup.
- **Three.js Animations:** Use `THREE.AnimationMixer` integrated with GSAP to smoothly blend character animations (typing -> standing -> waving -> walking -> idle).
- **Performance:** Use `drei`'s `<BakeShadows />` or lightmaps to avoid real-time shadow computation where possible. Use `will-change: transform` on HTML overlays.

---

## Phase 4: Organize and Prioritize (Top Ideas for Action)

1. **Single Global Canvas + HTML Overlays (Impact: High, Effort: Med)**
   *The standard approach for scroll-telling.*
2. **Camera Path Animation via ScrollTrigger (Impact: High, Effort: High)**
   *The core parallax experience.*
3. **GLTF Character Animation Blending (Impact: High, Effort: High)**
   *Crucial for the "typing to waving" transition.*

---

## Phase 5: Action Plan & Next Steps

### Step 1: Initialize the Project & Boilerplate
- Setup Vite + React 19 + Bun.
- Install dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@gsap/react`.
- Configure Biome for linting/formatting.

### Step 2: Establish the 3D Context & HTML Scroll Skeleton
- Create the main `<Canvas>` fixed to the viewport.
- Create dummy HTML sections (`100vh` each) to create scrollable space.
- Wire up a basic GSAP ScrollTrigger to animate a simple 3D cube's position based on scroll to prove the concept.

### Step 3: Asset Sourcing & Loading Screen
- Find or create a base 3D character (e.g., from ReadyPlayerMe or Mixamo) with animations: Idle, Typing, Stand Up, Wave, Walk.
- Implement the Loading Screen using `drei`'s `useProgress`.

### Step 4: The Hero Animation
- Load the character model.
- Set up the initial desk scene.
- Link the first 100vh of scroll to the character's animation mixer and camera movement.

### Questions for User:
1. **3D Assets:** Do you already have the 3D character and desk models (GLTF/GLB format), or should we use placeholder boxes/download free assets for now to build the logic?
2. **Framework:** I highly recommend using `react-three-fiber` since you are using React 19. It makes integrating Three.js with React state and GSAP much easier. Do you agree with this?
3. **Parallax Style:** For the 2.5D effect, do you want actual 3D depth (objects placed far away in Z-space) or layered images like the reference project? (The reference project `Portfolio-Website-main` seems to use a lot of HTML + GSAP, but since you want `Threejs`, actual Z-depth is best).
