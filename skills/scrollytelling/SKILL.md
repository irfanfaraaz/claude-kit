---
name: scrollytelling
description: 'Implements scroll-driven storytelling experiences with pinned sections, progressive reveals, and scroll-linked animations. Use when asked to build scrollytelling, scroll-driven animations, parallax effects, narrative scroll experiences, or story-driven landing pages.'
---

# Scrollytelling Skill

Build scroll-driven narrative experiences that reveal content, trigger animations, and create immersive storytelling as users scroll.

## What is Scrollytelling?

**Definition**: "A storytelling format in which visual and textual elements appear or change as the reader scrolls through an online article." When readers scroll, something other than conventional document movement happens.

**Origin**: The New York Times' "Snow Fall: The Avalanche at Tunnel Creek" (2012), which won the 2013 Pulitzer Prize for Feature Writing.

**Why it works**: Scrollytelling exploits a fundamental psychological principle—humans crave control. Every scroll is a micro-commitment that increases engagement. Users control the pace, creating deeper connection than passive consumption.

**Measured impact**:
- 400% longer time-on-page vs static content
- 67% improvement in information recall
- 5x higher social sharing rates
- 25-40% improved conversion completion

## Core Principles

### 1. Story First, Technology Second

The biggest mistake is leading with technology instead of narrative. Scrollytelling should enhance the story, not showcase effects.

### 2. User Agency & Progressive Disclosure

Users control the pace. Information reveals gradually to maintain curiosity. This shifts from predetermined pacing to user-controlled narrative flow.

### 3. Sequential Structure

Unlike hierarchical web content, scrollytelling demands linear progression with clear narrative beats. Each section builds on the previous.

### 4. Meaningful Change

Every scroll-triggered effect must serve the narrative. Gratuitous animation distracts rather than enhances.

### 5. Restraint Over Spectacle

Not every section needs animation. Subtle transitions often work better than constant effects. The format should amplify the content's message, not fight it.

## The 5 Standard Techniques

Research analyzing 50 scrollytelling articles identified these core patterns:

| Technique | Description | Best For |
|-----------|-------------|----------|
| **Graphic Sequence** | Discrete visuals that change completely at scroll thresholds | Data visualizations, step-by-step explanations |
| **Animated Transition** | Smooth morphing between states | State changes, evolution over time |
| **Pan and Zoom** | Scroll controls which portion of a visual is visible | Maps, large images, spatial narratives |
| **Moviescroller** | Frame-by-frame progression creating video-like effects | Product showcases, 3D object reveals |
| **Show-and-Play** | Interactive elements activate at scroll waypoints | Multimedia, audio/video integration |

## Layout Patterns

### Pattern 1: Side-by-Side Sticky (Most Common)

The classic scrollytelling pattern: a graphic becomes "stuck" while narrative text scrolls alongside. When the narrative concludes, the graphic "unsticks."

```
┌─────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────┐  │
│  │  Text    │  │                 │  │
│  │  Step 1  │  │    STICKY       │  │
│  ├──────────┤  │    GRAPHIC      │  │
│  │  Text    │  │                 │  │
│  │  Step 2  │  │  (updates with  │  │
│  ├──────────┤  │   active step)  │  │
│  │  Text    │  │                 │  │
│  │  Step 3  │  │                 │  │
│  └──────────┘  └─────────────────┘  │
└─────────────────────────────────────┘
```

**When to use**: Data visualization stories, step-by-step explanations, educational content requiring persistent visual context.

**Implementation**: Use CSS `position: sticky` (not JavaScript scroll listeners) for better performance and graceful degradation.

### Pattern 2: Full-Width Sections

Content spans the entire viewport with section-based transitions.

**When to use**: Highly visual narratives, immersive brand storytelling, portfolio showcases, timeline-based stories.

### Pattern 3: Layered Parallax

Multiple visual layers (background, midground, foreground) move at different speeds to create depth.

**When to use**: Atmospheric storytelling, game/product launches, long-form narratives where depth adds emotional impact.

**Accessibility warning**: Parallax triggers vestibular disorders (dizziness, nausea, migraines). Always provide reduced-motion fallback; limit to one subtle parallax effect per page maximum.

### Pattern 4: Multi-Directional

Combines vertical scrolling with horizontal sections or sideways timelines.

**When to use**: Timeline-based content, visually-driven showcases, unconventional layouts where surprise enhances the message.

## When to Use Scrollytelling

**Good candidates**:
- Long-form journalism with multimedia
- Brand storytelling celebrating achievements
- Product pages showcasing features
- Chronological/historical content
- Complex narratives broken into digestible chunks
- High-consideration products needing depth

**Avoid when**:
- You lack strong visual assets
- You're tight on time/budget (good scrollytelling requires more investment)
- The story lacks distinct chronology
- Content is brief
- Performance is critical on low-end devices

## Discovery Questions

Before implementing, clarify with the user:

```
header: "Scrollytelling Pattern"
question: "What scrollytelling pattern fits your narrative?"
options:
  - "Pinned narrative - text changes while visual stays fixed (NYT, Pudding.cool style)"
  - "Progressive reveal - content fades in as you scroll down"
  - "Parallax depth - layers move at different speeds (requires reduced-motion fallback)"
  - "Step sequence - discrete sections with transitions between"
  - "Hybrid - multiple patterns combined"
```

```
header: "Tech Stack"
question: "What's your frontend setup?"
options:
  - "React + Tailwind"
  - "React + CSS-in-JS"
  - "Next.js"
  - "Vue"
  - "Vanilla JS"
  - "Other"
```

```
header: "Animation Approach"
question: "Animation library preference?"
options:
  - "CSS-only (scroll-timeline API, IntersectionObserver) - best performance"
  - "GSAP ScrollTrigger - most powerful, cross-browser"
  - "Framer Motion / Motion - React ecosystem"
  - "Lenis + custom - smooth scroll"
  - "No preference - recommend based on complexity"
```

## Technical Implementation (2025-2026)

Moved to `references/technical-implementation-2025-2026.md`. Open it when the task needs this part.


## Accessibility Requirements

Accessibility is non-negotiable. Scrollytelling can trigger vestibular disorders and exclude keyboard/screen reader users if not implemented correctly.

### Critical WCAG Criteria

| Criterion | Requirement |
|-----------|-------------|
| **SC 2.2.2** | Auto-playing content >5 seconds needs pause/stop/hide controls |
| **SC 2.3.3** | User-triggered animations must be disableable |
| **SC 2.3.1** | No flashing more than 3 times per second |

### Reduced Motion Support (Mandatory)

**Always** respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In components - check before animating
useEffect(() => {
  if (prefersReducedMotion()) {
    // Show content immediately, skip animations
    return;
  }
  // Set up animations
}, []);
```

### Safe Animation Guidelines

| Animation Type | Safety |
|----------------|--------|
| Fade in/out, under 0.5s | Safe |
| Simple transforms | Safe |
| Parallax scrolling | Triggers vestibular issues - always provide fallback |
| Swooping, zooming | Problematic - avoid or provide fallback |
| Looping animations | Cognitive overload - limit iterations |

**Keep effects small**: Animations affecting more than 1/3 of the viewport can overwhelm users.

### Keyboard Navigation

- Add `tabindex="0"` to scrollable areas
- Ensure focus follows scroll targets when using smooth scrolling
- Provide skip links to major sections
- No keyboard traps in scroll regions

### Screen Reader Considerations

- Use proper heading hierarchy (`<h1>` through `<h6>`)
- DOM order must match logical reading order
- Use ARIA live regions for dynamic content updates
- Ensure all content exists in DOM (even if visually hidden initially)

## Performance Best Practices

### Do

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Add `will-change: transform` sparingly on animated elements
- Use `passive: true` on scroll listeners
- Use `position: sticky` over JS-based pinning
- Lazy load images/videos until needed
- Use single IntersectionObserver for multiple elements
- Test on real devices, not just desktop

### Don't

- Animate `width`, `height`, `top`, `left` (triggers layout recalculation)
- Use `will-change` excessively (increases memory usage)
- Create scroll listeners without cleanup
- Forget to handle reduced-motion preferences
- Use `overflow: hidden` on ancestors of sticky elements

### Performance Targets

- First Contentful Paint: under 2.5 seconds
- Maintain 60fps during scrolling
- Meet Core Web Vitals thresholds

## Mobile Considerations

Moved to `references/mobile-considerations.md`. Open it when the task needs this part.


## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **Scroll-jacking** | Overrides natural scroll, breaks accessibility | Preserve native scroll behavior |
| **Text-graphics conflict** | User can't read text while watching animation | Separate text and animated areas |
| **Animation overload** | Distracts from content, causes fatigue | Restraint—not every section needs effects |
| **No length indicator** | Users don't know commitment level | Add progress indicators |
| **Missing fallbacks** | Breaks for no-JS or reduced-motion users | Progressive enhancement |
| **Mobile neglect** | Excludes 60% of users | Mobile-first design |
| **Poor pacing** | Too fast or too slow content reveals | Test with real users |

## Implementation Workflow

1. **Understand the narrative** - What story are you telling? What's the sequence?
2. **Choose pattern** - Pinned, progressive, parallax, or hybrid?
3. **Plan accessibility** - How will reduced-motion users experience this?
4. **Select technology** - Native CSS, GSAP, Motion based on complexity
5. **Scaffold structure** - Build HTML/component structure first
6. **Add scroll mechanics** - Implement tracking (IntersectionObserver, ScrollTrigger, etc.)
7. **Wire animations** - Connect scroll state to visual changes
8. **Add reduced-motion fallbacks** - Content should work without animation
9. **Performance audit** - Check for jank, optimize
10. **Cross-device testing** - Mobile, tablet, desktop, different browsers
11. **Accessibility testing** - Keyboard nav, screen readers, reduced motion

## Output

After gathering requirements, implement the scrollytelling experience directly in the codebase. Provide:

1. Component structure with scroll tracking
2. Animation/transition logic with reduced-motion handling
3. Responsive adjustments (mobile-first)
4. Accessible fallbacks
5. Performance optimizations
6. Testing recommendations

## Notable Examples for Reference

- **NYT "Snow Fall"** - Origin story, multimedia integration
- **Pudding.cool** - Data journalism with audio-visual sync
- **National Geographic "Atlas of Moons"** - Educational, responsive design
- **BBC "Partition of India"** - Historical narrative with multimedia
- **Firewatch website** - Multi-layered parallax for atmosphere

## Sources

Research based on 100+ sources including EU Data Visualization Guide, MDN, GSAP documentation, W3C WCAG, A List Apart, Smashing Magazine, The Pudding, CSS-Tricks, and academic research on scrollytelling effectiveness.
