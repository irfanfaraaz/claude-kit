# Technical Implementation (2025-2026)

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

- Technical Implementation (2025-2026)
  - Technology Selection Guide
  - CSS Scroll-Driven Animations (Native - 2025+)
  - IntersectionObserver Pattern
  - GSAP ScrollTrigger (Complex Animations)
  - Motion (Framer Motion) for React
  - Scroll Progress Hook


## Technical Implementation (2025-2026)

### Technology Selection Guide

| Complexity | Recommendation | Bundle Size |
|------------|----------------|-------------|
| Simple reveals, progress bars | Native CSS scroll-timeline | 0 KB |
| Viewport-triggered effects | IntersectionObserver | 0 KB |
| Complex timelines, pinning | GSAP ScrollTrigger | ~23 KB |
| React projects | Motion (Framer Motion) | ~32 KB |
| Smooth scroll + effects | Lenis + GSAP | ~25 KB |

### CSS Scroll-Driven Animations (Native - 2025+)

**Browser support**:
- Chrome 115+: Full support (since July 2025)
- Safari 26+: Full support (since September 2025)
- Firefox: Requires flag (`layout.css.scroll-driven-animations.enabled`)

**Key properties**:
- `animation-timeline: scroll()` - links animation to scroll position
- `animation-timeline: view()` - links animation to element visibility
- `animation-range` - controls when animation starts/stops

**Example - View-triggered fade in**:
```css
@supports (animation-timeline: scroll()) {
  .reveal-on-scroll {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

**Example - Scroll-linked progress bar**:
```css
.progress-bar {
  animation: grow linear;
  animation-timeline: scroll();
}

@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

**Performance benefit**: Tokopedia achieved 80% code reduction and CPU usage dropped from 50% to 2% by switching to native CSS scroll-driven animations.

### IntersectionObserver Pattern

For scroll-triggered effects without continuous scroll tracking:

```tsx
const RevealOnScroll = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
```

### GSAP ScrollTrigger (Complex Animations)

For pinned sections, timeline orchestration, and cross-browser reliability:

```tsx
const ScrollytellingSection = ({ steps }) => {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      steps.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `.step-${index}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [steps]);

  return (
    <section ref={containerRef} className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Text column - scrolls naturally */}
        <div className="space-y-[100vh]">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`step-${i} min-h-screen flex items-center transition-opacity duration-300 ${
                activeStep === i ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual column - sticky */}
        <div className="relative hidden md:block">
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <StepVisual step={activeStep} data={steps[activeStep]} />
          </div>
        </div>
      </div>
    </section>
  );
};
```

### Motion (Framer Motion) for React

```tsx
import { motion, useScroll, useTransform } from 'motion/react';

const ScrollLinkedSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={ref} className="h-[200vh] relative">
      <motion.div
        className="sticky top-0 h-screen flex items-center justify-center"
        style={{ opacity, scale }}
      >
        <h2 className="text-6xl font-bold">Scroll-Linked Content</h2>
      </motion.div>
    </section>
  );
};
```

### Scroll Progress Hook

```tsx
const useScrollProgress = (ref) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 0 when element top enters viewport, 1 when bottom exits
      const start = rect.top - windowHeight;
      const end = rect.bottom;
      const current = -start;
      const total = end - start;

      setProgress(Math.max(0, Math.min(1, current / total)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [ref]);

  return progress;
};
```
