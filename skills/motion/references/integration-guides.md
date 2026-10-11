# Integration Guides

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

- Integration Guides
  - Vite + React + TypeScript
  - Next.js App Router (Recommended Pattern)
  - Next.js Pages Router
  - Tailwind CSS Integration
  - Cloudflare Workers (✅ Now Supported)


## Integration Guides

### Vite + React + TypeScript

```bash
pnpm add motion
```

Import: `import { motion } from "motion/react"`

**No Vite configuration needed** - works out of the box.

### Next.js App Router (Recommended Pattern)

**Key Requirement**: Motion only works in **Client Components** (not Server Components).

**Step 1: Create Client Component Wrapper**

`src/components/motion-client.tsx`:
```tsx
"use client"

// Optimized import for Next.js (reduces client JS)
import * as motion from "motion/react-client"

export { motion }
```

**Step 2: Use in Server Components**

`src/app/page.tsx`:
```tsx
import { motion } from "@/components/motion-client"

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      This works in Server Component (wrapper is client)
    </motion.div>
  )
}
```

**Alternative: Direct Client Component**
```tsx
"use client"

import { motion } from "motion/react"

export function AnimatedCard() {
  return <motion.div>...</motion.div>
}
```

**Known Issues (Next.js 15+ + React 19)**:
- React 19 fully supported as of December 2025 (see Issue #11 for one StrictMode edge case)
- Most compatibility issues resolved in Motion 12.27.5
- AnimatePresence may fail with soft navigation
- Reorder component incompatible with Next.js routing and page-level scrolling (see Issue #10)

### Next.js Pages Router

Works without modifications:

```tsx
import { motion } from "motion/react"

export default function Page() {
  return <motion.div>No "use client" needed</motion.div>
}
```

### Tailwind CSS Integration

**Best Practice**: Let each library do what it does best.

- **Tailwind**: Static and responsive styling via `className`
- **Motion**: Animations via motion props

```tsx
<motion.button
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
>
  Tailwind styles + Motion animations
</motion.button>
```

**⚠️ Remove Tailwind Transitions**: Causes stuttering/conflicts.
```tsx
// ❌ Wrong - Tailwind transition conflicts with Motion
<motion.div className="transition-all duration-300" animate={{ x: 100 }} />

// ✅ Correct - Remove Tailwind transition
<motion.div animate={{ x: 100 }} />
```

**Why**: Motion uses inline styles or native browser animations, both override Tailwind's CSS transitions.

### Cloudflare Workers (✅ Now Supported)

**Status**: ✅ **Fixed as of December 2024** (GitHub issue #2918 closed as completed)

**Installation**:
```bash
# Motion now works directly with Cloudflare Workers
pnpm add motion
```

**Import:**
```tsx
import { motion } from "motion/react"
```

**Historical Note**: Prior to December 2024, there was a Wrangler ESM resolution issue requiring use of `framer-motion` as a workaround. This has been resolved, and both packages now work correctly with Cloudflare Workers.
