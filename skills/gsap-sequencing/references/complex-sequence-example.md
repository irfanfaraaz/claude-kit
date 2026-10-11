# Complex Sequence Example

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Complex Sequence Example

### Page Transition

```javascript
function pageTransition(currentPage, nextPage) {
  const tl = gsap.timeline();

  // Exit current page
  tl.to(currentPage, {
    opacity: 0,
    x: -50,
    duration: 0.3,
    ease: 'power2.in'
  })

  // Transition overlay
  .to('.overlay', {
    scaleY: 1,
    transformOrigin: 'bottom',
    duration: 0.4,
    ease: 'power2.inOut'
  }, '-=0.1')

  // Swap content (instant)
  .set(currentPage, { display: 'none' })
  .set(nextPage, { display: 'block', opacity: 0, x: 50 })

  // Hide overlay
  .to('.overlay', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 0.4,
    ease: 'power2.inOut'
  })

  // Enter next page
  .to(nextPage, {
    opacity: 1,
    x: 0,
    duration: 0.3,
    ease: 'power2.out'
  }, '-=0.2');

  return tl;
}
```

### Orchestrated UI Reveal

```javascript
function revealDashboard() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.addLabel('start')

    // Header slides down
    .from('.header', { y: -100, opacity: 0, duration: 0.6 }, 'start')

    // Sidebar slides in
    .from('.sidebar', { x: -100, opacity: 0, duration: 0.6 }, 'start+=0.1')

    // Cards stagger in
    .from('.card', {
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1
    }, 'start+=0.2')

    // Charts animate
    .from('.chart-bar', {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 0.4,
      stagger: 0.05
    }, 'start+=0.4')

    // Final CTA pops
    .from('.cta-button', {
      scale: 0,
      ease: 'back.out(1.7)',
      duration: 0.4
    }, '-=0.2');

  return tl;
}
```
