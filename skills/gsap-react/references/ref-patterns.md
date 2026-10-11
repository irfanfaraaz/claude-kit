# Ref Patterns

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Ref Patterns

### Single Element Ref

```tsx
function SingleElement() {
  const boxRef = useRef(null);

  useGSAP(() => {
    gsap.to(boxRef.current, {
      x: 200,
      rotation: 360,
      duration: 1
    });
  });

  return <div ref={boxRef}>Box</div>;
}
```

### Multiple Element Refs

```tsx
function MultipleElements() {
  const itemsRef = useRef([]);

  useGSAP(() => {
    gsap.from(itemsRef.current, {
      opacity: 0,
      y: 30,
      stagger: 0.1
    });
  });

  return (
    <div>
      {[1, 2, 3].map((item, i) => (
        <div
          key={item}
          ref={el => itemsRef.current[i] = el}
        >
          Item {item}
        </div>
      ))}
    </div>
  );
}
```

### Dynamic Refs

```tsx
function DynamicList({ items }) {
  const itemsRef = useRef(new Map());

  useGSAP(() => {
    gsap.from(Array.from(itemsRef.current.values()), {
      opacity: 0,
      y: 20,
      stagger: 0.05
    });
  }, { dependencies: [items.length] });

  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          ref={el => {
            if (el) itemsRef.current.set(item.id, el);
            else itemsRef.current.delete(item.id);
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
```
