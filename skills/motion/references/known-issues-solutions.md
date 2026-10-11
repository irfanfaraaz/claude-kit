# Known Issues & Solutions

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

- Known Issues & Solutions
  - Issue 1: AnimatePresence Exit Not Working
  - Issue 2: Large List Performance
  - Issue 3: Tailwind Transitions Conflict
  - Issue 4: Next.js "use client" Missing
  - Issue 5: Scrollable Container Layout Animations
  - Issue 6: Cloudflare Workers Build Errors (✅ RESOLVED)
  - Issue 7: Fixed Position Layout Animations
  - Issue 8: layoutId + AnimatePresence Unmounting
  - Issue 9: Reduced Motion with AnimatePresence (✅ RESOLVED)
  - Issue 10: Reorder Component Limitations
  - Issue 11: React 19 StrictMode Drag Bug
  - Issue 12: Layout Animations in Scaled Containers
  - Issue 13: AnimatePresence Exit Gets Stuck on Unmount
  - Issue 14: Percentage Values Break Layout Animations in Flex Containers
  - Issue 15: Sub-Pixel Precision Loss in popLayout Mode


## Known Issues & Solutions

### Issue 1: AnimatePresence Exit Not Working

**Error**: Exit animations don't play, components disappear instantly
**Source**: [GitHub Issue #3078](https://github.com/motiondivision/motion/issues/3078)

**Why It Happens**: AnimatePresence wrapped in conditional or missing `key` props. Defining `exit` props on staggered children inside modals can also prevent modal from unmounting (backdrop remains visible).

**Solution**:
```tsx
// ❌ Wrong - AnimatePresence wrapped in conditional
{isVisible && (
  <AnimatePresence>
    <motion.div>Content</motion.div>
  </AnimatePresence>
)}

// ✅ Correct - AnimatePresence stays mounted
<AnimatePresence>
  {isVisible && <motion.div key="unique">Content</motion.div>}
</AnimatePresence>

// ❌ Wrong - Staggered children with exit prevent modal removal
<AnimatePresence>
  {isOpen && (
    <Modal>
      <motion.ul>
        {items.map(item => (
          <motion.li
            key={item.id}
            exit={{ opacity: 1, scale: 1 }}  // ← Prevents modal unmount
          >
            {item.content}
          </motion.li>
        ))}
      </motion.ul>
    </Modal>
  )}
</AnimatePresence>

// ✅ Fix for modal - Remove exit from children or set duration: 0
<motion.li
  key={item.id}
  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0 } }}
>
  {item.content}
</motion.li>
```

### Issue 2: Large List Performance

**Symptom**: 50-100+ animated items cause severe slowdown, browser freezes.

**Solution**: Use virtualization:
```bash
pnpm add react-window
```

See `references/performance-optimization.md` for full guide.

### Issue 3: Tailwind Transitions Conflict

**Symptom**: Animations stutter or don't work.

**Solution**: Remove `transition-*` classes:
```tsx
// ❌ Wrong
<motion.div className="transition-all" animate={{ x: 100 }} />

// ✅ Correct
<motion.div animate={{ x: 100 }} />
```

### Issue 4: Next.js "use client" Missing

**Symptom**: Build fails with "motion is not defined" or SSR errors.

**Solution**: Add `"use client"` directive:
```tsx
"use client"

import { motion } from "motion/react"
```

See `references/nextjs-integration.md` for App Router patterns.

### Issue 5: Scrollable Container Layout Animations

**Symptom**: Incomplete transitions when removing items from scrolled containers.

**Solution**: Add `layoutScroll` prop:
```tsx
<motion.div layoutScroll className="overflow-auto">
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Issue 6: Cloudflare Workers Build Errors (✅ RESOLVED)

**Status**: ✅ **Fixed in December 2024** (GitHub issue #2918 closed as completed)

**Previous Symptom**: Wrangler build failed with React import errors when using `motion` package.

**Current State**: Motion now works correctly with Cloudflare Workers. No workaround needed.

**If you encounter build issues**: Ensure you're using Motion v12.23.24 or later and Wrangler v3+.

GitHub issue: #2918 (closed as completed Dec 13, 2024)

### Issue 7: Fixed Position Layout Animations

**Symptom**: Layout animations in fixed elements have incorrect positioning.

**Solution**: Add `layoutRoot` prop:
```tsx
<motion.div layoutRoot className="fixed top-0 left-0">
  <motion.div layout>Content</motion.div>
</motion.div>
```

### Issue 8: layoutId + AnimatePresence Unmounting

**Symptom**: Elements with `layoutId` inside AnimatePresence fail to unmount.

**Solution**: Wrap in `LayoutGroup` or avoid mixing exit + layout animations:
```tsx
import { LayoutGroup } from "motion/react"

<LayoutGroup>
  <AnimatePresence>
    {items.map(item => (
      <motion.div key={item.id} layoutId={item.id}>
        {item.content}
      </motion.div>
    ))}
  </AnimatePresence>
</LayoutGroup>
```

### Issue 9: Reduced Motion with AnimatePresence (✅ RESOLVED)

**Status**: ✅ **Fixed in January 2023** (GitHub issue #1567 closed via PR #1891)

**Previous Symptom**: MotionConfig reducedMotion setting didn't affect AnimatePresence animations.

**Current State**: MotionConfig now correctly applies reducedMotion to AnimatePresence components. The setting works as documented.

**Optional Manual Control**: If you need custom behavior beyond the built-in support:
```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

<motion.div
  initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
/>
```

GitHub issue: #1567 (closed as completed Jan 13, 2023)

### Issue 10: Reorder Component Limitations

**Error**: Reorder auto-scroll fails, doesn't work with Next.js routing
**Source**: [GitHub Issue #3469](https://github.com/motiondivision/motion/issues/3469), #2183, #2101

**Why It Happens**:
- **Page-level scrolling**: Reorder auto-scroll only works when `Reorder.Group` is inside element with `overflow: auto/scroll`, NOT when document itself is scrollable
- **Next.js routing**: Incompatible with Next.js routing system, causes random stuck states

**Prevention**:
```tsx
// ❌ Wrong - Page-level scrolling (auto-scroll fails)
<body style={{ height: "200vh" }}>
  <Reorder.Group values={items} onReorder={setItems}>
    {/* Auto-scroll doesn't trigger at viewport edges */}
  </Reorder.Group>
</body>

// ✅ Correct - Container with overflow
<div style={{ height: "300px", overflow: "auto" }}>
  <Reorder.Group values={items} onReorder={setItems}>
    {items.map(item => (
      <Reorder.Item key={item.id} value={item}>
        {item.content}
      </Reorder.Item>
    ))}
  </Reorder.Group>
</div>

// ✅ Alternative - Use DnD Kit for complex cases
// Motion docs officially recommend DnD Kit for:
// - Multi-row reordering
// - Dragging between columns
// - Page-level scrollable containers
// - Complex drag-and-drop interactions

// Install: pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

See `references/nextjs-integration.md` for full Next.js troubleshooting guide.

### Issue 11: React 19 StrictMode Drag Bug

**Error**: Drag gestures break when dragging from top to bottom in file trees
**Source**: [GitHub Issue #3169](https://github.com/motiondivision/motion/issues/3169)

**Why It Happens**: Only occurs with React 19 + StrictMode enabled + Ant Design components. Dragged element position breaks and appears offset. Does NOT occur in React 18 or React 19 without StrictMode. Only affects top-to-bottom drag (bottom-to-top works fine).

**Prevention**: Temporarily disable StrictMode for React 19 projects using drag gestures, or use React 18 if StrictMode is critical. Awaiting official fix from Motion team.

### Issue 12: Layout Animations in Scaled Containers

**Error**: Layout animations start from incorrect positions in scaled parent containers
**Source**: [GitHub Issue #3356](https://github.com/motiondivision/motion/issues/3356)

**Why It Happens**: Layout animation system uses scaled coordinates as if they were unscaled. Motion's layout animations work in pixels, while parent scale affects visual coordinates. The mismatch causes position calculation errors.

**Prevention (Community Workaround)**:
```tsx
// Use transformTemplate to correct for parent scale
const scale = 2; // Parent's transform scale value

<div style={{ transform: `scale(${scale})` }}>
  <motion.div
    layout
    transformTemplate={(latest, generated) => {
      const match = /translate3d\((.+)px,\s?(.+)px,\s?(.+)px\)/.exec(generated);
      if (match) {
        const [, x, y, z] = match;
        return `translate3d(${Number(x) / scale}px, ${Number(y) / scale}px, ${Number(z) / scale}px)`;
      }
      return generated;
    }}
  >
    Content
  </motion.div>
</div>
```

**Limitations**: Only works for layout animations only, doesn't fix other transforms, requires knowing parent scale value.

### Issue 13: AnimatePresence Exit Gets Stuck on Unmount

**Error**: Exit state stuck when child unmounts during exit animation
**Source**: [GitHub Issue #3243](https://github.com/motiondivision/motion/issues/3243)

**Why It Happens**: When child component inside AnimatePresence unmounts immediately after exit animation triggers, exit state gets stuck. Component incorrectly remains in "exit" state.

**Prevention**: Don't unmount motion components while AnimatePresence is handling their exit. Ensure motion.div stays mounted until exit completes. Use conditional rendering only on parent AnimatePresence children.

### Issue 14: Percentage Values Break Layout Animations in Flex Containers

**Error**: Layout animations teleport instantly instead of animating smoothly
**Source**: [GitHub Issue #3401](https://github.com/motiondivision/motion/issues/3401)

**Why It Happens**: Using percentage-based x values in initial prop breaks layout animations when container uses display flex with justify-content center. Motion's layout animations work in pixels, while CSS percentage transforms are resolved relative to element/parent. The coordinate system mismatch causes position recalculation mid-frame.

**Prevention**: Convert percentage to pixels before animation. Calculate container width and use pixel values instead of percentage strings.

### Issue 15: Sub-Pixel Precision Loss in popLayout Mode

**Error**: 1px layout shift just before exit transition starts
**Source**: [GitHub Issue #3260](https://github.com/motiondivision/motion/issues/3260)

**Why It Happens**: When using AnimatePresence with mode popLayout, exiting element dimensions are captured and reapplied as inline styles. Sub-pixel values from getBoundingClientRect are rounded to nearest integer, causing visible layout shift. Can cause text wrapping changes.

**Prevention**: Use whole pixel values only for dimensions, or avoid popLayout for sub-pixel-sensitive layouts. No perfect workaround exists.
