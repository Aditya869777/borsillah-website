# BORSILLAH WEB DESIGN RULEBOOK
## The 16-Repository Audit — Mandatory Pre-Code Checklist

> **STRICT RULE**: Before writing a single line of code for any page or section,  
> every item in this rulebook MUST be consulted and checked off. No exceptions.

---

## PART 1: THE 16 REPOSITORY AUDIT

### 1. TASTE SKILL (Leonxlnx/taste-skill)
**What it is**: A portable design intelligence skill for AI coding agents. It contains  
anti-slop guidance, configurable "dials" for design variance, motion intensity and  
visual density, and a final taste-audit checklist.

**Mandatory usage rules**:
- `DESIGN_VARIANCE = HIGH` — No repetitive layout patterns across sections.
- `MOTION_INTENSITY = MEDIUM-HIGH` — Scroll-linked animations yes. Spinning everything no.
- `VISUAL_DENSITY = ABOVE DEFAULT` — No empty landing-page whitespace. Every section earns its space.
- **Run a final taste audit** after every section: "Does this look like a generic AI site?"  
  If yes, redesign it.
- **Anti-repetition check**: No two sections can use the same compositional pattern.

---

### 2. UI/UX PRO MAX (nextlevelbuilder/ui-ux-pro-max-skill)
**What it is**: 79 UI styles, 192 colour palettes, 74 font pairings, 119 UX guidelines,  
25 chart types, 22 technology stacks — structured as a design intelligence engine.

**Mandatory usage rules**:
- **Font system** (chosen from its 74 pairings):
  - `--serif: "Cormorant Garamond"` → Headings, hero, big editorial type
  - `--sans: "Inter"` → Body copy, UI labels  
  - `--mono: "DM Mono"` → Eyebrows, section numbers, specs, metadata
- **Colour system** (from its 192 palettes — matched to Borsillah brand):
  - `--ink: #12100d` (near-black)
  - `--dark: #0d0b08` (deepest dark)
  - `--cream: #f3eee1` (warm paper)
  - `--tea: #a94125` (Assam red)
  - `--gold: #cf9b34` (accent gold)
  - `--olive: #5b6038` (earth green)
- **Hierarchy rule**: 3-level max per section. Eyebrow → Heading → Body.
- **Contrast**: All text meets WCAG AA. Light-on-dark and dark-on-light both tested.
- **Responsive**: Mobile-first. Every layout collapses to single-column at ≤900px.

---

### 3. AWESOME DESIGN.MD (DorianGallo/awesome-design-md)
**What it is**: Reference library of DESIGN.md documents — plain-text design systems  
that define how a UI should look, feel and move.

**Mandatory usage rules**:
- A Borsillah-specific `DESIGN.md` must exist before code is written.
- The DESIGN.md defines: spacing scale, typographic scale, section rhythm,  
  depth / layering model, motion model, responsive breakpoints.
- **Spacing scale**: `8px` base unit. All padding/margin is a multiple of 8.
- **Section rhythm**: Each section gets a `min-height: 100svh` or justified minimum.
- **Depth model**: 3 layers — background, midground (floating imagery), foreground (type).

---

### 4. GETDESIGN (MohtashamMurshid/getdesign)
**What it is**: Extracts palette, typography, components, layout and motion rules  
from a reference URL or existing site.

**Mandatory usage for Borsillah**:
- The prototype HTML/CSS is the "reference site". Its design language was extracted  
  and is encoded in this rulebook (colours, fonts, spacing above).
- Do NOT copy Txemalon or any other portfolio. The Borsillah prototype IS the reference.
- Result of extraction: Cormorant Garamond + DM Mono + Inter stack, warm cream/dark palette.

---

### 5. SCREENSHOT-TO-CODE (jiawenwan/screenshot-to-code)
**What it is**: Converts screenshots or screen recordings into working HTML/CSS/React code.

**Mandatory usage for Borsillah**:
- Used for reconstructing individual section layouts from the prototype visuals.  
- The prototype's culture wall, ecosystem ring, scale map, and vision grid were analyzed  
  this way — each section's spatial composition was directly transcribed to code.
- **Never** used to generate the full IA. Only individual visual compositions.

---

### 6. 21ST.DEV / 21ST MCP (21st-dev/magic-mcp)
**What it is**: Searchable library of React/Tailwind UI components for coding agents.

**Mandatory usage rule**:
- Consulted for ONE specific primitive per need: the custom cursor, the marquee tape,  
  or the scroll progress rail.
- **Never paste in unrelated components**. Every component must earn its place.

---

### 7. MAGIC UI (magicuidesign/magicui)
**What it is**: Open-source animated React effects — marquees, text treatments,  
animated backgrounds, micro-interactions.

**Mandatory usage for Borsillah**:
- The section-03 `bridge-marquee` running tape: `PRODUCT · PEOPLE · SYSTEMS · DISTRIBUTION ·`  
  is implemented using a pure CSS `@keyframes marquee` loop — the approach taken  
  directly from Magic UI's marquee primitive.
- The `.reveal` entrance animation pattern (opacity + translateY) mirrors Magic UI's  
  `FadeIn` pattern.

---

### 8. ACETERNITY UI (aceternity-ui/ui)
**What it is**: Advanced animated React/Tailwind component patterns.

**Mandatory usage for Borsillah**:
- The `noise` texture overlay (SVG fractal noise fixed to the viewport) is the  
  Aceternity-style approach to adding tactile grain to a dark interface.
- The hero product "halo" glow behind the product image uses the radial gradient  
  depth technique popularised in Aceternity's spotlight components.
- Maximum 2-3 Aceternity-style effects per page. Not stacked randomly.

---

### 9. LENIS (darkroomengineering/lenis)
**What it is**: Smooth scrolling and scroll-event sync library.

**Mandatory usage**:
- Lenis is the **only** smooth-scroll system. No competing loops.
- Connected to GSAP ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- All anchor `scrollIntoView` is routed through Lenis.
- `prefers-reduced-motion` disables Lenis entirely.

---

### 10. GSAP + SCROLLTRIGGER (greensock/GSAP)
**What it is**: Primary cinematic animation and sequencing engine.

**Mandatory architecture**:
```
Lenis → GSAP ticker → ScrollTrigger → normalized scroll progress → R3F state / DOM animation
```
- Every section reveal is a GSAP-powered timeline (not just CSS transitions).
- Parallax depth: product image travels at `y: -60px` over the hero scroll distance.
- Section headings use `stagger: 0.08` for word-by-word reveals where applicable.
- `scrub: true` on hero parallax for frame-perfect scroll control.
- `useGSAP()` hook used in React for proper cleanup.

---

### 11. LOTTIE WEB (airbnb/lottie-web)
**What it is**: Renders After Effects / JSON animations on the web.

**Mandatory usage rule for Borsillah**:
- Used ONLY for small vector 2D moments: a tea-leaf icon animation on section dividers,  
  or a subtle logo reveal.
- NOT used for 3D objects or complex spatial scenes.
- Mental model: **R3F = 3D physical world. Lottie = compact authored 2D motion.**

---

### 12. REACT THREE FIBER — R3F (pmndrs/react-three-fiber)
**What it is**: React renderer for Three.js.

**Mandatory usage for Borsillah**:
- The `BorsillahTeaPack` procedural 3D component lives here.
- Each section maps to a named `TeaPackState` (yaw, pitch, roll, posX, posY, posZ, scale).
- The canvas is `position: fixed`, behind all DOM content.
- On mobile: the canvas is inside the hero section (scrolls away), not fixed.
- `useFrame` drives per-frame interpolation toward the target state.

---

### 13. DREI (pmndrs/drei)
**What it is**: Helper components and utilities for R3F / Three.js.

**Mandatory usage**:
- `<Environment preset="studio" />` for physically-based lighting.
- `<Suspense>` boundary with a DOM fallback for the R3F canvas.
- `useTexture` for loading the front/back product images onto the pouch material.
- No `<OrbitControls>` in production.

---

### 14. THREE.JS (mrdoob/three.js)
**What it is**: Core 3D engine. Used directly when R3F abstraction is insufficient.

**Mandatory usage for Borsillah**:
- `BoxGeometry` heavily subdivided → vertex-displaced to create the pouch silhouette.
- Top/bottom vertices pinched to form heat-seal crimps.
- Middle vertices bulged outward for organic fullness.
- `MeshPhysicalMaterial` with `clearcoat`, `roughness`, `metalness` for foil-like sheen.
- UV mapping so the front texture maps to exactly the front face group.
- `geo.computeVertexNormals()` called after every vertex modification.

---

### 15. PLAYWRIGHT CLI (microsoft/playwright)
**What it is**: Browser QA for coding agents. Test the live site, not just the code.

**Mandatory QA checklist (run AFTER build)**:
- [ ] Open http://localhost:3000 in Chromium
- [ ] Scroll through all 13 sections
- [ ] Verify all `.reveal` elements become visible
- [ ] Verify custom cursor appears on desktop
- [ ] Verify progress rail updates (01 → 13)
- [ ] Test on mobile viewport (390px wide)
- [ ] Verify all images load (no broken src)
- [ ] Verify no console errors
- [ ] Take screenshot at hero, vision, closing sections
- [ ] Verify `prefers-reduced-motion` disables animations

---

### 16. TXEMALON 3D PORTFOLIO (Txemalon/3d-portfolio)
**What it is**: Architecture reference ONLY. The state-driven section→3D-state pattern.

**Mandatory usage rule**:
- **DO NOT CLONE THIS REPO** for the Borsillah build.
- Use it ONLY as a conceptual reference for:
  - `SECTION_STATES` shape (yaw, pitch, roll, posX, posY, posZ, scale)
  - `useFrame` interpolation pattern using `THREE.MathUtils.lerp`
  - `data-section` IntersectionObserver pattern
- All code is written from scratch for Borsillah.

---

## PART 2: THE PRE-CODE CHECKLIST

Before writing a single line of code for any section, answer YES to all:

- [ ] Has the DESIGN.md colour/font/spacing system been loaded?
- [ ] Is this section compositionally different from the previous one?
- [ ] Does this section avoid generic cards, capsules, or dashboard layouts?
- [ ] Is the typography hierarchy correct (eyebrow → heading → body)?
- [ ] Is the motion purposeful — does it have a narrative reason?
- [ ] Is mobile handled first, then desktop enhanced?
- [ ] Are all Third-party libraries used only for their intended purpose?
- [ ] Has a Taste audit been mentally run? ("Would a senior designer cringe?")

---

## PART 3: BORSILLAH MOTION RULES

1. The tea pouch feels like a physical object — no snap transitions.
2. Scroll progress moves the story, not just spins the object.
3. Parallax has multiple depth planes (image, text, background move at different rates).
4. Section changes feel continuous — no hard cuts.
5. Camera motion is smooth and physically believable.
6. Do NOT blur excessively. Do NOT scale everything independently.
7. Do NOT animate every word independently (use group reveals).
8. Every major motion has a narrative reason stated in code comments.
9. `prefers-reduced-motion` disables all non-essential animation.
10. Mobile: animations are simplified (no parallax depth planes, just reveal fades).
