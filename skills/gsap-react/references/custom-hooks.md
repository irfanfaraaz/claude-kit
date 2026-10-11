# Custom Hooks

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Custom Hooks

### useAnimation Hook

```tsx
function useAnimation(animation, deps = []) {
  const elementRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(() => {
    if (elementRef.current) {
      tweenRef.current = animation(elementRef.current);
    }
    return () => tweenRef.current?.kill();
  }, { dependencies: deps });

  return elementRef;
}

// Usage
function Component() {
  const boxRef = useAnimation((el) =>
    gsap.from(el, { opacity: 0, y: 50, duration: 0.5 })
  );

  return <div ref={boxRef}>Animated</div>;
}
```

### useFadeIn Hook

```tsx
function useFadeIn(options = {}) {
  const { duration = 0.5, delay = 0, y = 30 } = options;
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y,
      duration,
      delay,
      ease: 'power2.out'
    });
  });

  return ref;
}

// Usage
function Card() {
  const cardRef = useFadeIn({ delay: 0.2 });
  return <div ref={cardRef}>Card content</div>;
}
```

### useHoverAnimation Hook

```tsx
function useHoverAnimation(enterAnimation, leaveAnimation) {
  const ref = useRef(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const onEnter = contextSafe(() => enterAnimation(ref.current));
  const onLeave = contextSafe(() => leaveAnimation(ref.current));

  return { ref, onMouseEnter: onEnter, onMouseLeave: onLeave };
}

// Usage
function Button() {
  const hoverProps = useHoverAnimation(
    (el) => gsap.to(el, { scale: 1.05, duration: 0.2 }),
    (el) => gsap.to(el, { scale: 1, duration: 0.2 })
  );

  return <button {...hoverProps}>Hover me</button>;
}
```
