# Mobile Considerations

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

- Mobile Considerations
  - Mobile-First Design Philosophy
  - Viewport Units: vh vs svh vs dvh vs lvh
  - Touch Scroll Physics
  - Preventing Gesture Conflicts
  - Passive Event Listeners
  - Scroll Snap on Mobile
  - Touch Accessibility
  - Browser-Specific Quirks
  - Responsive Layout Strategy
  - Mobile Performance Strategies
  - When to Simplify or Abandon Scrollytelling on Mobile
  - Mobile Testing Checklist


## Mobile Considerations

Mobile users represent 60%+ of web traffic. Scrollytelling must work excellently on mobile or risk excluding the majority of users.

### Mobile-First Design Philosophy

**Start with mobile**: "Starting with mobile first forces you to pare down your experience to the nuts and bolts, leaving only the necessities. This refines and focuses the content." (The Pudding)

Design the core experience for mobile, then enhance for desktop—not the reverse. This approach:
- Forces essential-only content decisions
- Improves development efficiency
- Results in less code if desktop is functionally similar

### Viewport Units: vh vs svh vs dvh vs lvh

Mobile browsers toggle navigation bars during scrolling, breaking traditional `100vh` layouts.

| Unit | Definition | When To Use |
|------|------------|-------------|
| `vh` | Large viewport (browser UI hidden) | **Legacy fallback only** |
| `svh` | Small viewport (browser UI visible) | **Use for ~90% of layouts** (recommended) |
| `lvh` | Large viewport (browser UI hidden) | Modals/overlays maximizing space |
| `dvh` | Dynamic viewport (changes constantly) | **Use sparingly** - causes layout thrashing |

**Critical warning**: "I initially thought 'dynamic viewport units are the future' and used dvh for every element. This was a mistake. The constant layout shifts felt broken."

**Implementation pattern**:

```css
.full-height-section {
  height: 100vh;  /* Fallback for older browsers */
  height: 100svh; /* Modern solution - small viewport */
}

/* Progressive enhancement */
@supports (height: 100svh) {
  :root {
    --viewport-height: 100svh;
  }
}
```

**JavaScript alternative** (The Pudding's recommendation):

```javascript
function setViewportHeight() {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
setViewportHeight();
```

```css
.section {
  height: calc(var(--vh) * 100);
}
```

### Touch Scroll Physics

**Momentum scrolling**: Content continues scrolling after touch release, decelerating naturally. iOS and Android have different friction curves—iOS feels more "flicky."

**Critical for iOS**:

```css
.scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS momentum - still needed for pre-iOS 13 */
}
```

**Performance note**: Scroll events fire at END of momentum on iOS, not during. Use IntersectionObserver instead of scroll listeners for step detection.

### Preventing Gesture Conflicts

**Pull-to-Refresh conflicts**:

```css
/* Disable PTR but keep bounce effects */
html {
  overscroll-behavior-y: contain;
}

/* Or disable completely */
html {
  overscroll-behavior-y: none;
}
```

**Scroll chaining in modals**:

```css
.modal-content {
  overflow-y: auto;
  overscroll-behavior: contain; /* Prevents scrolling parent when modal hits boundary */
}
```

**Horizontal swipe conflicts** (browser back/forward):

```css
.horizontal-carousel {
  touch-action: pan-y pinch-zoom; /* Allow vertical scroll & zoom, block horizontal */
}
```

### Passive Event Listeners

Chrome 56+ defaults touch listeners to passive for 60fps scrolling. Use passive listeners for monitoring, non-passive only when you must `preventDefault()`:

```javascript
// ✅ Monitoring scroll (passive - default, best performance)
document.addEventListener('touchstart', trackTouch, { passive: true });

// ⚠️ Only when you MUST prevent default (e.g., custom swipe)
carousel.addEventListener('touchmove', handleSwipe, { passive: false });
```

**Prefer CSS over JavaScript**:

```css
/* Better than JavaScript preventDefault */
.element {
  touch-action: pan-y pinch-zoom;
}
```

### Scroll Snap on Mobile

Scroll snap works well on mobile with `mandatory` (avoid `proximity` on touch devices):

```css
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.section {
  scroll-snap-align: start;
  min-height: 100svh;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .scroll-container {
    scroll-snap-type: none;
    scroll-behavior: auto;
  }
}
```

**Warning**: Never use `mandatory` if content can overflow the viewport—users won't be able to scroll to see it.

### Touch Accessibility

**Minimum touch target sizes**:

| Standard | Size | When |
|----------|------|------|
| WCAG 2.5.8 (AA) | 24×24px | Minimum compliance |
| WCAG 2.5.5 (AAA) | 44×44px | **Best practice** |
| Apple iOS | 44×44pt | Recommended |
| Android | 48×48dp | Recommended |

**Expand touch area without changing visual size**:

```css
.small-button {
  width: 24px;
  height: 24px;
  padding: 10px; /* Creates 44×44px touch target */
}
```

**Always provide button alternatives for gesture-only actions**:

```html
<!-- Swipe to delete MUST have button alternative -->
<div class="item">
  <span>Content</span>
  <button aria-label="Delete">Delete</button>
</div>
```

### Browser-Specific Quirks

**iOS Safari**:

```css
/* Position sticky requires no overflow on ancestors */
.parent {
  /* overflow: hidden; ❌ Breaks sticky on iOS */
}

.sticky {
  position: -webkit-sticky; /* Prefix still needed */
  position: sticky;
  top: 0;
}
```

```css
/* Preventing body scroll in modals requires JavaScript on iOS */
/* CSS overflow: hidden doesn't work on body */
```

```javascript
// iOS modal scroll lock
function lockScroll() {
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
}
```

**Chrome Android**:

```css
/* Disable pull-to-refresh */
body {
  overscroll-behavior-y: none;
}
```

### Responsive Layout Strategy

**Side-by-Side → Stacked pattern**:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* On mobile: stacked, full-width */}
  {/* On desktop: side-by-side sticky */}
  <div className="space-y-[50vh] md:space-y-[100vh]">
    {/* Text steps - shorter spacing on mobile */}
  </div>
  <div className="hidden md:block">
    {/* Sticky visual - hidden on mobile, shown on desktop */}
  </div>
</div>
```

**Synchronize CSS and JS breakpoints**:

```javascript
const breakpoint = '(min-width: 800px)';
const isDesktop = window.matchMedia(breakpoint).matches;

if (isDesktop) {
  initScrollama(); // Complex scrollytelling
} else {
  initStackedView(); // Simple stacked layout
}

// Listen for breakpoint changes
window.matchMedia(breakpoint).addEventListener('change', (e) => {
  if (e.matches) {
    initScrollama();
  } else {
    initStackedView();
  }
});
```

**Mobile alternative patterns**:
- Replace sticky graphics with inline graphics between text sections
- Use simpler reveal animations instead of complex parallax
- Stack static images with scroll-triggered captions
- Consider whether scrollytelling is even appropriate

### Mobile Performance Strategies

**Target: 60fps (16.7ms per frame)**

**Use hardware-accelerated properties only**:

```css
.animate {
  /* ✅ Good - GPU accelerated */
  transform: translateY(100px);
  opacity: 0.5;

  /* ❌ Bad - triggers layout recalculation */
  /* top: 100px; width: 200px; margin: 20px; */
}
```

**Use `will-change` sparingly**:

```css
/* Only on elements about to animate */
.about-to-animate {
  will-change: transform;
}

/* Remove when animation completes */
.animation-complete {
  will-change: auto;
}
```

**Warning**: Too many composited layers hurt mobile performance. Don't apply `will-change` to everything.

**Throttle scroll handlers with requestAnimationFrame**:

```javascript
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateAnimation();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

**Better: Use IntersectionObserver** (no scroll events):

```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateElement(entry.target);
    }
  });
});
```

### When to Simplify or Abandon Scrollytelling on Mobile

**Keep scrollytelling when**:
- Transitions are truly meaningful to the narrative
- Spatial movement or temporal change is core to understanding
- Performance targets can be met (60fps, <3s load)
- Testing shows mobile users successfully comprehend content

**Simplify scrollytelling when**:
- Performance is acceptable but animations aren't essential
- Some complexity is nice-to-have but not required
- Desktop experience is richer but mobile should be functional

**Abandon scrollytelling when**:
- Performance issues can't be resolved on mid-tier devices
- Mobile users are confused or frustrated in testing
- Development timeline doesn't allow proper optimization
- Content works just as well in simpler stacked format
- Animations are decorative, not meaningful

**"The most important reason to preserve scroll animations is if the transitions are truly meaningful, not just something to make it pop."** (The Pudding)

### Mobile Testing Checklist

**Device Coverage**:
- [ ] iPhone (latest 2 models) - Safari
- [ ] iPhone - Chrome
- [ ] iPad - Safari (portrait & landscape)
- [ ] Android flagship - Chrome
- [ ] Android mid-tier - Chrome (critical for performance)
- [ ] Tablet Android - Chrome

**Viewport Testing**:
- [ ] Address bar hide/show transitions smooth
- [ ] No layout jumping during scroll
- [ ] Fixed elements stay positioned correctly
- [ ] svh/dvh units behaving as expected

**Performance Testing**:
- [ ] 60fps maintained during scroll (use Chrome DevTools FPS meter)
- [ ] No janky animations
- [ ] Images lazy-load properly
- [ ] Memory doesn't leak on long sessions
- [ ] Test with CPU throttling (4x slowdown in DevTools)

**Interaction Testing**:
- [ ] Touch scrolling feels natural (momentum)
- [ ] No accidental interactions
- [ ] Pull-to-refresh disabled if needed
- [ ] Scroll chaining behaves correctly

**Accessibility Testing**:
- [ ] Works with reduced motion enabled
- [ ] Touch targets minimum 44×44px
- [ ] Button alternatives for all gestures
- [ ] Screen reader (VoiceOver/TalkBack) can navigate

**Critical**: Chrome DevTools mobile emulator does NOT accurately simulate browser UI behavior. Test on real devices or use BrowserStack/Sauce Labs
